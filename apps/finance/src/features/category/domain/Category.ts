import { DateVO } from '@machado-repo/shared';

export type CategoryProps = {
  id: string;
  name: string;
  description?: string;
  created_at: Date;
  updated_at?: Date;
};

export class Category {
  public readonly id: string;
  public readonly name: string;
  public readonly description: string | undefined;
  public readonly created_at: Date;
  public readonly updated_at: Date | undefined;

  private constructor(
    props: CategoryProps,
  ) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
  }

  public static create(props: CategoryProps): Category {
    const createdAtResult = DateVO.tryCreate(props.created_at);
    if (createdAtResult.isFailure) {
      throw new Error(`Invalid category created_at: ${createdAtResult.error}`);
    }

    if (props.updated_at) {
      const updatedAtResult = DateVO.tryCreate(props.updated_at);
      if (updatedAtResult.isFailure) {
        throw new Error(`Invalid category updated_at: ${updatedAtResult.error}`);
      }
    }

    return new Category(props);
  }
}
