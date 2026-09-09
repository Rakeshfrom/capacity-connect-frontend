import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';

type AuditLog = {
  id: number;
  actorName: string;
  action: string;
  module: string;
  target: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  createdAt: string;
};

const API_BASE = '/api';

const formatDate = (value: string) =>
  new Date(value).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });


const AuditLogs = () => {
  const [logs, setLogs] = React.useState<AuditLog[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch(`${API_BASE}/audit-logs`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch audit logs');
        }
        return response.json();
      })
      .then((data: AuditLog[]) => setLogs(data))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box sx={{ bgcolor: '#F5F8FA', minHeight: '100vh' }}>
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
        <Box sx={{ mb: 4 }}>
          <Typography
            sx={{
              color: '#0B5A91',
              fontWeight: 700,
              fontSize: '0.82rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Admin Portal
          </Typography>

          <Typography
            sx={{
              color: '#173F60',
              fontWeight: 800,
              fontSize: { xs: '2rem', md: '2.6rem' },
              mt: 0.5,
            }}
          >
            Audit Logs
          </Typography>

          <Typography sx={{ color: '#657887', mt: 1 }}>
            Review administrative actions and platform activity history.
          </Typography>
        </Box>

        <Card
          elevation={0}
          sx={{
            border: '1px solid #DCE8F0',
            borderRadius: 2,
          }}
        >
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ p: { xs: 2.5, md: 3 } }}>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 1.5,
                    bgcolor: '#EAF4FB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <HistoryOutlinedIcon sx={{ color: '#0B5A91' }} />
                </Box>

                <Box>
                  <Typography
                    sx={{
                      color: '#173F60',
                      fontWeight: 700,
                      fontSize: '1.15rem',
                    }}
                  >
                    Recent Activity
                  </Typography>

                  <Typography sx={{ color: '#657887', fontSize: '0.9rem' }}>
                    Latest recorded administrative actions.
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <Divider />

            {loading ? (
              <Box sx={{ p: 4 }}>
                <Typography sx={{ color: '#657887' }}>
                  Loading audit logs...
                </Typography>
              </Box>
            ) : logs.length === 0 ? (
              <Box sx={{ p: 4 }}>
                <Typography sx={{ color: '#657887' }}>
                  No audit activity recorded yet.
                </Typography>
              </Box>
            ) : (
              logs.map((log, index) => (
              <Box key={`${log.action}-${formatDate(log.createdAt)}`}>
                <Box
                  sx={{
                    px: { xs: 2.5, md: 3 },
                    py: 2.5,
                  }}
                >
                  <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    sx={{
                      justifyContent: 'space-between',
                      gap: 2,
                    }}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        sx={{
                          color: '#173F60',
                          fontWeight: 700,
                          fontSize: '1rem',
                        }}
                      >
                        {log.action}
                      </Typography>

                      <Typography
                        sx={{
                          color: '#657887',
                          mt: 0.7,
                          fontSize: '0.92rem',
                        }}
                      >
                        {log.target}
                      </Typography>

                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          mt: 1.3,
                          rowGap: 1,
                        }}
                      >
                        <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
                          <PersonOutlineOutlinedIcon
                            sx={{ fontSize: 17, color: '#718594' }}
                          />
                          <Typography
                            sx={{
                              color: '#718594',
                              fontSize: '0.84rem',
                            }}
                          >
                            {log.actorName}
                          </Typography>
                        </Stack>

                        <Chip
                          label={log.module}
                          size="small"
                          sx={{
                            bgcolor: '#EAF4FB',
                            color: '#0B5A91',
                            fontWeight: 600,
                          }}
                        />
                      </Stack>
                    </Box>

                    <Stack
                      sx={{
                        alignItems: { xs: 'flex-start', md: 'flex-end' },
                        flexShrink: 0,
                      }}
                      spacing={0.8}
                    >
                      <Chip
                        label={log.status}
                        size="small"
                        sx={{
                          bgcolor:
                            log.status === 'COMPLETED'
                              ? '#EAF6EF'
                              : '#FFF3E0',
                          color:
                            log.status === 'COMPLETED'
                              ? '#147A45'
                              : '#A35A00',
                          fontWeight: 700,
                        }}
                      />

                      <Typography
                        sx={{
                          color: '#718594',
                          fontSize: '0.82rem',
                        }}
                      >
                        {formatDate(log.createdAt)}
                      </Typography>
                    </Stack>
                  </Stack>
                </Box>

                {index < logs.length - 1 && <Divider />}
              </Box>
              ))
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default AuditLogs;
