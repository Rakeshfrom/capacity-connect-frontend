import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Divider,
  MenuItem,
  Paper,
  Rating,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';

const courses = [
  'Foundations of Meteorological Science',
  'Climate Science & Applications',
  'Weather Forecasting & Services',
];

const submittedFeedback = [
  {
    course: 'Weather Forecasting & Services',
    rating: 5,
    comment:
      'The course content was well structured and the practical examples were very useful.',
    date: '28 August 2026',
  },
];

const Feedback = () => {
  const [course, setCourse] = useState('');
  const [overallRating, setOverallRating] = useState<number | null>(0);
  const [contentRating, setContentRating] = useState<number | null>(0);
  const [trainerRating, setTrainerRating] = useState<number | null>(0);
  const [experienceRating, setExperienceRating] = useState<number | null>(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
  };

  return (
    <Box sx={{ bgcolor: '#F5F8FA', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Typography
          variant="h3"
          sx={{
            color: '#173F60',
            fontWeight: 700,
            fontSize: { xs: '2rem', md: '2.5rem' },
          }}
        >
          Feedback
        </Typography>

        <Typography sx={{ color: '#657887', mt: 1, lineHeight: 1.7 }}>
          Share your learning experience and help improve future training
          programmes.
        </Typography>

        <Paper
          elevation={0}
          sx={{
            mt: 4,
            p: { xs: 2.5, md: 4 },
            border: '1px solid #DCE8F0',
            borderRadius: 2,
          }}
        >
          <Typography
            sx={{
              color: '#173F60',
              fontWeight: 700,
              fontSize: '1.35rem',
            }}
          >
            Submit feedback
          </Typography>

          <Typography sx={{ color: '#657887', mt: 0.75, mb: 3 }}>
            Your feedback helps trainers and administrators improve the
            learning experience.
          </Typography>

          <TextField
            select
            fullWidth
            label="Select course"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            sx={{ mb: 4 }}
          >
            {courses.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </TextField>

          <Typography
            sx={{
              color: '#173F60',
              fontWeight: 700,
              fontSize: '1.05rem',
              mb: 2,
            }}
          >
            Rate your experience
          </Typography>

          <Stack spacing={2.5}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              sx={{
                gap: 1,
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', sm: 'center' },
              }}
            >
              <Typography sx={{ color: '#536A7B' }}>
                Overall learning experience
              </Typography>
              <Rating
                value={overallRating}
                onChange={(_, value) => setOverallRating(value)}
              />
            </Stack>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              sx={{
                gap: 1,
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', sm: 'center' },
              }}
            >
              <Typography sx={{ color: '#536A7B' }}>
                Course content & materials
              </Typography>
              <Rating
                value={contentRating}
                onChange={(_, value) => setContentRating(value)}
              />
            </Stack>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              sx={{
                gap: 1,
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', sm: 'center' },
              }}
            >
              <Typography sx={{ color: '#536A7B' }}>
                Trainer effectiveness
              </Typography>
              <Rating
                value={trainerRating}
                onChange={(_, value) => setTrainerRating(value)}
              />
            </Stack>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              sx={{
                gap: 1,
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', sm: 'center' },
              }}
            >
              <Typography sx={{ color: '#536A7B' }}>
                Learning platform experience
              </Typography>
              <Rating
                value={experienceRating}
                onChange={(_, value) => setExperienceRating(value)}
              />
            </Stack>
          </Stack>

          <TextField
            fullWidth
            multiline
            minRows={5}
            label="Additional comments"
            placeholder="Tell us what worked well and what could be improved..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            sx={{ mt: 4 }}
          />

          {submitted && (
            <Box
              sx={{
                mt: 3,
                p: 2,
                borderRadius: 1.5,
                bgcolor: '#EDF8F1',
                border: '1px solid #CDE8D7',
              }}
            >
              <Stack
                direction="row"
                spacing={1}
                sx={{ alignItems: 'center' }}
              >
                <CheckCircleOutlineOutlinedIcon sx={{ color: '#17834B' }} />
                <Typography
                  sx={{ color: '#176B40', fontWeight: 600 }}
                >
                  Feedback submitted successfully.
                </Typography>
              </Stack>
            </Box>
          )}

          <Button
            variant="contained"
            startIcon={<SendOutlinedIcon />}
            onClick={handleSubmit}
            disabled={!course}
            sx={{
              mt: 3,
              px: 3,
              py: 1.2,
              bgcolor: '#0B6497',
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Submit feedback
          </Button>
        </Paper>

        <Box sx={{ mt: 5 }}>
          <Typography
            sx={{
              color: '#173F60',
              fontWeight: 700,
              fontSize: '1.35rem',
              mb: 2,
            }}
          >
            Submitted feedback
          </Typography>

          <Stack spacing={2}>
            {submittedFeedback.map((item) => (
              <Paper
                key={item.course}
                elevation={0}
                sx={{
                  p: { xs: 2.5, md: 3 },
                  border: '1px solid #DCE8F0',
                  borderRadius: 2,
                }}
              >
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
              sx={{
                gap: 1,
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', sm: 'center' },
              }}
                >
                  <Box>
                    <Typography
                      sx={{ color: '#173F60', fontWeight: 700 }}
                    >
                      {item.course}
                    </Typography>

                    <Typography
                      sx={{ color: '#7A8B98', fontSize: '0.88rem', mt: 0.5 }}
                    >
                      Submitted {item.date}
                    </Typography>
                  </Box>

                  <Rating value={item.rating} readOnly size="small" />
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Typography
                  sx={{ color: '#536A7B', lineHeight: 1.7 }}
                >
                  {item.comment}
                </Typography>
              </Paper>
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Feedback;
