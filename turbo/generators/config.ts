import type { PlopTypes } from '@turbo/gen';


export default function generator(plop: PlopTypes.NodePlopAPI) {
  plop.setGenerator('component', {
    description: 'Generate a new component',
    prompts: [
      {
        type: 'list',
        name: 'project',
        message: 'What type of project should the component be created in?',
        choices: ['apps', 'packages'],
      },
      {
        type: 'input',
        name: 'workspace',
        message: 'Workspace name (e.g. src)',
        validate: (input: string) => {
          if (input.includes('.')) {
            return 'file Workspace cannot include an extension';
          }
          if (input.match(' ')) {
            return 'file Workspace cannot include spaces';
          }
          if (!input) {
            return 'file Workspace is required';
          }
          return true;
        },
        default: 'src'
      },
      {
        type: 'list',
        name: 'module',
        message: 'What module should the component be created in?',
        choices: ['finance', 'ui'],
      },
      {
        type: 'confirm',
        name: 'includeDocs',
        message: 'Should it generate Storybook documentation for the component?',
        default: true,
        when: (answers) => answers.module === 'ui'
      },
      {
        type: 'list',
        name: 'type',
        message: 'What type of component should be created ?',
        choices: ['primitives', 'components'],
        when: (answers) => answers.module === 'ui'
      },
      {
        type: 'input',
        name: 'name',
        message: 'Component name (e.g. my-component)',
        validate: (input: string) => {
          if (input.includes('.')) {
            return 'file name cannot include an extension';
          }
          if (input.match(' ')) {
            return 'file name cannot include spaces';
          }
          if (!input) {
            return 'file name is required';
          }
          return true;
        }
      }
    ],
    actions: (answers) => {
      const actions: PlopTypes.ActionType[] = [];
      const currentType = answers.type || 'components';

      // Create Component Index if not Exist
      actions.push({
        type: 'add',
        path: `{{ project }}/{{ module }}/{{ workspace }}/${currentType}/index.ts`,
        template: ``,
        skipIfExists: true,
      })

      // Create Component File!
      actions.push({
        type: 'add',
        path: `{{ project }}/{{ module }}/{{ workspace }}/${currentType}/{{ kebabCase name }}/{{ pascalCase name }}.tsx`,
        templateFile: 'templates/component/Component.tsx.hbs',
      });

      // Create Index File!
      actions.push({
        type: 'add',
        path: `{{ project }}/{{ module }}/{{ workspace }}/${currentType}/{{ kebabCase name }}/index.ts`,
        templateFile: 'templates/component/component-index.ts.hbs',
      });

      // Add in Index File Components!
      actions.push({
        type: 'append',
        path: `{{ project }}/{{ module }}/{{ workspace }}/${currentType}/index.ts`,
        templateFile: 'templates/component/index.ts.hbs',
      });

      // Add Unit Test
      actions.push({
        type: 'add',
        path: `{{ project }}/{{ module }}/test/${currentType}/{{ pascalCase name }}.test.tsx`,
        templateFile: 'templates/component/Component.test.tsx.hbs',
      });

      if(answers.includeDocs) {
        // Add in Docs Storybook File Component!
        actions.push({
          type: 'add',
          path: `apps/docs/stories/${currentType}/{{ kebabCase name }}/{{ pascalCase name }}.stories.tsx`,
          templateFile: 'templates/component/Component.stories.tsx.hbs',
        });
      }

      return actions;
    }
  });
}