import { useEffect, useState } from 'react';
import { Alert, Card, Col, Descriptions, Row, Spin, Statistic, Typography } from 'antd';
import { getHealth, type HealthResponse } from '../services/api';
import { APP_VERSION } from '@lms/shared';

export function DashboardPage() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getHealth()
      .then(setHealth)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)));
  }, []);

  return (
    <Card>
      <Typography.Title level={3}>Tổng quan hệ thống</Typography.Title>
      <Typography.Paragraph type="secondary">
        EduCenter LMS · phiên bản {APP_VERSION} — Scaffold Phase 1 (T001–T007)
      </Typography.Paragraph>

      {error && <Alert type="error" showIcon message="Không kết nối được API" description={error} />}

      {!health && !error && (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <Spin size="large" tip="Đang kiểm tra API /api/health..." />
        </div>
      )}

      {health && (
        <>
          <Alert
            type={health.status === 'ok' ? 'success' : 'warning'}
            showIcon
            message={`API: ${health.status.toUpperCase()} — PostgreSQL: ${health.database} · Redis: ${health.redis}`}
          />
          <Row gutter={16} style={{ marginTop: 16 }}>
            <Col span={8}>
              <Card size="small">
                <Statistic title="Database (educ_lms)" value={health.database} />
              </Card>
            </Col>
            <Col span={8}>
              <Card size="small">
                <Statistic title="Redis (BullMQ)" value={health.redis} />
              </Card>
            </Col>
            <Col span={8}>
              <Card size="small">
                <Statistic title="Uptime (giây)" value={health.uptime} />
              </Card>
            </Col>
          </Row>
          <Descriptions column={1} size="small" style={{ marginTop: 16 }}>
            <Descriptions.Item label="Thời điểm kiểm tra">{health.timestamp}</Descriptions.Item>
          </Descriptions>
        </>
      )}
    </Card>
  );
}
