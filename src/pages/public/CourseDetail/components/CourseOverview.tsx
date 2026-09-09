import { Box, Paper, Stack, Typography } from '@mui/material';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import SignalCellularAltOutlinedIcon from '@mui/icons-material/SignalCellularAltOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';

type CourseOverviewProps = {
  duration: string;
  level: string;
};

const CourseOverview = ({ duration, level }: CourseOverviewProps) => {
  const items = [
    {
      icon: <AccessTimeOutlinedIcon />,
      label: 'Duration',
      value: duration,
    },
    {
      icon: <SignalCellularAltOutlinedIcon />,
      label: 'Level',
      value: level,
    },
    {
      icon: <SchoolOutlinedIcon />,
      label: 'Learning Mode',
      value: 'Online',
    },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.5, sm: 3 },
        border: '1px solid #DCE6ED',
        borderRadius: 2,
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 2.5, sm: 4 }}
      >
        {items.map((item) => (
          <Box
            key={item.label}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              flex: 1,
            }}
          >
            <Box sx={{ color: '#0B5A91' }}>{item.icon}</Box>

            <Box>
              <Typography
                variant="caption"
                sx={{ color: '#718594', display: 'block' }}
              >
                {item.label}
              </Typography>

              <Typography
                sx={{ color: '#244A66', fontWeight: 700, mt: 0.2 }}
              >
                {item.value}
              </Typography>
            </Box>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
};

export default CourseOverview;
