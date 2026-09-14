import { Box, Button, Container, Paper, Stack, Typography } from '@mui/material';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { Link as RouterLink } from 'react-router-dom';

const Signup = () => (
  <Box sx={{ minHeight: 'calc(100vh - 120px)', bgcolor: '#F3F7FA', py: { xs: 4, md: 7 } }}>
    <Container maxWidth="md">
      <Paper
        elevation={0}
        sx={{ p: { xs: 3, sm: 5 }, border: '1px solid #D8E4EB', borderRadius: 3, boxShadow: '0 18px 50px rgba(19, 63, 96, 0.08)' }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography sx={{ color: '#075B91', fontWeight: 800, fontSize: { xs: '1.8rem', sm: '2.2rem' } }}>
            Create your CAPACITY CONNECT account
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1, lineHeight: 1.7 }}>
            Choose how you will use the platform. Trainees register directly; trainer access follows the institutional verification pathway.
          </Typography>
        </Box>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2.2}>
          <Paper variant="outlined" sx={{ flex: 1, p: 3, borderRadius: 2.5, borderColor: '#CFE0EA' }}>
            <SchoolOutlinedIcon sx={{ color: '#075B91', fontSize: 36 }} />
            <Typography sx={{ mt: 1.5, fontWeight: 800, fontSize: '1.25rem', color: '#173F60' }}>
              Trainee account
            </Typography>
            <Typography color="text.secondary" sx={{ mt: .8, lineHeight: 1.65 }}>
              Create an account to discover programmes, access learning resources, complete assessments and track your learning.
            </Typography>
            <Button
              component={RouterLink}
              to="/signup/trainee"
              fullWidth
              variant="contained"
              endIcon={<ArrowForwardRoundedIcon />}
              sx={{ mt: 2.2, bgcolor: '#075B91', textTransform: 'none', fontWeight: 700, borderRadius: 1.5 }}
            >
              Sign up as Trainee
            </Button>
          </Paper>

          <Paper variant="outlined" sx={{ flex: 1, p: 3, borderRadius: 2.5, borderColor: '#CFE0EA' }}>
            <WorkspacePremiumOutlinedIcon sx={{ color: '#075B91', fontSize: 36 }} />
            <Typography sx={{ mt: 1.5, fontWeight: 800, fontSize: '1.25rem', color: '#173F60' }}>
              Trainer application
            </Typography>
            <Typography color="text.secondary" sx={{ mt: .8, lineHeight: 1.65 }}>
              Submit your professional qualification, experience and CV. Administrator review and competency assessment are required before trainer access is granted.
            </Typography>
            <Button
              component={RouterLink}
              to="/signup/trainer"
              fullWidth
              variant="outlined"
              endIcon={<ArrowForwardRoundedIcon />}
              sx={{ mt: 2.2, color: '#075B91', borderColor: '#AFC7D5', textTransform: 'none', fontWeight: 700, borderRadius: 1.5 }}
            >
              Apply as Trainer
            </Button>
          </Paper>
        </Stack>

        <Typography sx={{ mt: 3, textAlign: 'center', color: '#718594', fontSize: '.9rem' }}>
          Already have an account?{' '}
          <Button component={RouterLink} to="/login" sx={{ p: 0, minWidth: 0, color: '#075B91', textTransform: 'none', fontWeight: 750 }}>
            Sign in
          </Button>
        </Typography>
      </Paper>
    </Container>
  </Box>
);

export default Signup;
