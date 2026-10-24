export type PipelineStep<I, O> = (input: I) => Promise<O>;

export class Pipeline<I, O> {
  private constructor(private readonly fn: (input: I) => Promise<O>) {}

  static pipe<I, O>(step: PipelineStep<I, O>): Pipeline<I, O> {
    return new Pipeline<I, O>(step);
  }

  pipe<N>(step: PipelineStep<O, N>): Pipeline<I, N> {
    return new Pipeline<I, N>(async (input) => step(await this.fn(input)));
  }

  build(): (input: I) => Promise<O> {
    return this.fn;
  }
}
