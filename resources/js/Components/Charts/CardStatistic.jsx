import { Typography } from 'antd';

export default function CardStatistic({
  className,
  value,
  description,
  valueStyle = 'currency',
  decimal = 0,
  currency = 'IDR',
}) {
  const { Text } = Typography;

  return (
    <div className="flex h-[124px]">
      <div className={`w-1 ${className}`} />
      <div className="grow flex items-center bg-white shadow-[0_4px_20px_0_rgba(218,218,218,0.25)]">
        <div className="grow pl-5 pr-6 space-y-1">
          <Text className="block text-2xl">
            {valueStyle === 'currency'
              ? value.toLocaleString('id-ID', { style: 'currency', currency, maximumFractionDigits: decimal })
              : value.toLocaleString(undefined, { maximumFractionDigits: decimal })}
          </Text>
          <Text className="block text-gray-900">
            {description}
          </Text>
        </div>
      </div>
    </div>
  );
}
