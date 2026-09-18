import { IconGallery, IconItem } from '@storybook/blocks';

import { OIcon, getIcon, ICON_GROUPS } from '@machado-repo/icons';
import { Icon } from '@machado-repo/ui';

export function IconographyGallery() {
  return (
    <IconGallery>
      {OIcon.map((iconName) => {
        const size = 'base';
        const tone = 'primary';

        const iconData = getIcon({
          name: iconName,
          size,
          tone,
          withDefault: false,
        });

        return (
          <IconItem
            key={iconName}
            name={`${iconData.group} > ${iconName}`}
          >
            <Icon
              icon={iconName}
              size={size}
              color={color}
              withDefault={false}
            />
          </IconItem>
        );
      })}
    </IconGallery>
  );
}