import { DateVO } from '@machado-repo/shared';

export type InstitutionProps = {
  id: string;
  name: string;
  created_at: Date;
  updated_at?: Date;
};

export class Institution {
  public readonly id: string;
  public readonly name: string;
  public readonly created_at: Date;
  public readonly updated_at: Date | undefined;

  private constructor(props: InstitutionProps) {
    this.id = props.id;
    this.name = props.name;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
  }

  public static create(props: InstitutionProps): Institution {
    const createdAtResult = DateVO.tryCreate(props.created_at);
    if (createdAtResult.isFailure) {
      throw new Error(`Invalid institution created_at: ${createdAtResult.error}`);
    }

    if (props.updated_at) {
      const updatedAtResult = DateVO.tryCreate(props.updated_at);
      if (updatedAtResult.isFailure) {
        throw new Error(`Invalid institution updated_at: ${updatedAtResult.error}`);
      }
    }

    return new Institution(props);
  }
}
