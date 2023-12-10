import { Typography } from 'antd';

export default function CardSubLayout({
  heading, children, className, ...props
}) {
  const { Title } = Typography;

  return (
    <div
      className={`
        bg-white max-w-full p-6 space-y-4 border border-gray-200
        ${className}
      `}
      {...props}
    >
      {heading && <Title level={3} className="!font-medium">{heading}</Title>}
      {children}
    </div>
  );
}
