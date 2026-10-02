import { MDXRemote } from "next-mdx-remote/rsc";
import type { MDXRemoteProps } from "next-mdx-remote/rsc";

const components: MDXRemoteProps["components"] = {
  h2: (props) => <h2 className="mt-10 mb-4 font-display text-3xl text-navy" {...props} />,
  h3: (props) => <h3 className="mt-8 mb-3 font-display text-2xl text-navy" {...props} />,
  p: (props) => <p className="mb-5 text-lg leading-8 text-ink/90" {...props} />,
  ul: (props) => <ul className="mb-5 list-disc space-y-2 pl-5 text-lg leading-8" {...props} />,
  ol: (props) => <ol className="mb-5 list-decimal space-y-2 pl-5 text-lg leading-8" {...props} />,
  a: (props) => <a className="text-navy underline decoration-gold underline-offset-4" {...props} />,
};

export function MdxContent({ source }: { source: string }) {
  return <MDXRemote source={source} components={components} />;
}
