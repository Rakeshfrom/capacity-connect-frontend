import { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
} from '@mui/material';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import { getTrainerAnalytics } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import TrainerAnalyticsVisuals from './TrainerAnalyticsVisuals';

type TrainerAnalyticsData = {
  trainerId: number;
  totalTrainees: number;
  averageCompletion: number;
  averageAssessmentScore: number;
  overallPerformance: number;
};

const statCards = (analytics: TrainerAnalyticsData | null) => analytics ? [
  { label: 'Active Trainees', value: `${analytics.totalTrainees}`, hint: 'Current total', icon: <PeopleOutlineOutlinedIcon /> },
  { label: 'Average Completion', value: `${analytics.averageCompletion}%`, hint: 'Current average', icon: <SchoolOutlinedIcon /> },
  { label: 'Average Assessment Score', value: `${analytics.averageAssessmentScore}%`, hint: 'Completed attempts', icon: <AssessmentOutlinedIcon /> },
  { label: 'Overall Performance', value: `${analytics.overallPerformance}%`, hint: 'Completion + assessment', icon: <TrendingUpOutlinedIcon /> },
] : [];

export default function TrainerAnalytics() {
  const { user, loading: authLoading } = useAuth();
  const [analytics, setAnalytics] = useState<TrainerAnalyticsData | null>(null);

  useEffect(() => {
    if (authLoading || !user) return;
    getTrainerAnalytics(user.id)
      .then((data) => setAnalytics(data as TrainerAnalyticsData))
      .catch((error) => console.error('Failed to load trainer analytics:', error));
  }, [user, authLoading]);

  return (
    <Box sx={{ bgcolor: '#F5F8FA', minHeight: '100vh' }}>
      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
        <Box sx={{ mb: 3 }}>
          <Typography sx={{ color: '#0B5A91', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.09em', textTransform: 'uppercase' }}>
            Trainer Portal
          </Typography>
          <Typography sx={{ color: '#173F60', fontWeight: 800, fontSize: { xs: '2rem', md: '2.55rem' }, mt: 0.5 }}>
            Analytics
          </Typography>
          <Typography sx={{ color: '#657887', mt: 0.8 }}>
            Turn trainee activity, course completion and assessment attempts into clear coaching decisions.
          </Typography>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 2.2, mb: 2.5 }}>
          {statCards(analytics).map((stat) => (
            <Card key={stat.label} elevation={0} sx={{ border: '1px solid #DCE8F0', borderRadius: 2.5 }}>
              <CardContent sx={{ p: 2.4 }}>
                <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography sx={{ color: '#657887', fontSize: '0.86rem' }}>{stat.label}</Typography>
                    <Typography sx={{ color: '#173F60', fontWeight: 900, fontSize: '2rem', mt: 0.3 }}>{stat.value}</Typography>
                    <Typography sx={{ color: '#0B5A91', fontWeight: 700, fontSize: '0.78rem', mt: 0.4 }}>{stat.hint}</Typography>
                  </Box>
                  <Box sx={{ width: 42, height: 42, borderRadius: 1.5, bgcolor: '#EAF4FB', color: '#0B5A91', display: 'grid', placeItems: 'center' }}>
                    {stat.icon}
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>

        <TrainerAnalyticsVisuals />
      </Container>
    </Box>
  );
}
