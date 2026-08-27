import { Card, Empty, Typography } from 'antd';

export function PlaceholderPage({ title }: { title: string }) {
  return (
    <Card>
      <Typography.Title level={4}>{title}</Typography.Title>
      <Empty description="Trang này sẽ được triển khai ở các phase sau (xem progress-tracker)." />
    </Card>
  );
}
