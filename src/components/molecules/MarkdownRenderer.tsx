import React from "react";
import ReactMarkdown from "react-markdown";

interface Props {
  content: string;
}

interface State {
  hasError: boolean;
}

export class MarkdownRenderer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("Markdown render error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center">
          <p className="text-red-500">コンテンツの表示に失敗しました</p>
          <pre className="whitespace-pre-wrap">{this.props.content}</pre>
        </div>
      );
    }

    return (
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="mt-6 mb-3 font-bold text-2xl text-gray-600 underline">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mt-5 mb-2 font-bold text-xl text-gray-600 underline">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-5 mb-2 font-bold text-lg text-gray-600">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="mb-1 leading-relaxed">{children}</p>
          ),
          strong: ({ children }) => (
            <span className="my-3 leading-relaxed font-bold">{children}</span>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside my-2 pl-2 space-y-1">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-dicimal list-inside my-2 pl-2 space-y-1">
              {children}
            </ol>
          ),
          code: ({ className, children, ...props }) => {
            const isInline = !className;
            return isInline ? (
              <code
                className="mb-1 py-2 px-3 text-sm bg-gray-200 border rounded"
                {...props}
              >
                {children}
              </code>
            ) : (
              <code
                className="mb-1 py-2 px-3 text-sm text-white bg-gray-500 border rounded overflow-x-auto"
                {...props}
              >
                {children}
              </code>
            );
          },
        }}
      >
        {this.props.content}
      </ReactMarkdown>
    );
  }
}
