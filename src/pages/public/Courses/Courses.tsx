import {
  Box,
  Container,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { useEffect, useMemo, useState } from 'react';
import { getCourses } from '../../../services/api';
import CourseCard from './components/CourseCard';

type Course = {
  id: number;
  category?: string;
  title?: string;
  description?: string;
  durationHours?: number;
  duration?: string;
  level?: string;
};

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [level, setLevel] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCourses()
      .then((data) => setCourses(Array.isArray(data) ? data : []))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    return Array.from(
      new Set(
        courses
          .map((course) => course.category)
          .filter(Boolean)
          .map((value) => String(value))
      )
    );
  }, [courses]);

  const levels = useMemo(() => {
    return Array.from(
      new Set(
        courses
          .map((course) => course.level)
          .filter(Boolean)
          .map((value) => String(value))
      )
    );
  }, [courses]);

  const filteredCourses = useMemo(() => {
    const query = search.trim().toLowerCase();

    return courses.filter((course) => {
      const matchesSearch =
        !query ||
        `${course.title ?? ''} ${course.description ?? ''} ${course.category ?? ''}`
          .toLowerCase()
          .includes(query);

      const matchesCategory =
        category === 'all' ||
        String(course.category ?? '').toLowerCase() === category.toLowerCase();

      const matchesLevel =
        level === 'all' ||
        String(course.level ?? '').toLowerCase() === level.toLowerCase();

      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [courses, search, category, level]);

  return (
    <Box sx={{ bgcolor: '#F5F8FA', minHeight: '100%' }}>
      <Box
        sx={{
          bgcolor: '#EAF4FB',
          borderBottom: '1px solid #DCE8F0',
          py: { xs: 5, md: 6 },
        }}
      >
        <Container maxWidth="xl">
          <Typography
            sx={{
              color: '#0B5A91',
              fontWeight: 700,
              fontSize: '0.82rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Learning Catalogue
          </Typography>

          <Typography
            variant="h2"
            sx={{
              color: '#173F60',
              fontWeight: 800,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              mt: 1,
            }}
          >
            Explore Courses
          </Typography>

          <Typography
            sx={{
              color: '#657887',
              maxWidth: 760,
              mt: 1.5,
              lineHeight: 1.7,
              fontSize: { xs: '0.95rem', md: '1.05rem' },
            }}
          >
            Discover structured training programmes designed to support
            professional learning and capacity development.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          sx={{ mb: 4 }}
        >
          <TextField
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses..."
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlinedIcon sx={{ color: '#718594' }} />
                  </InputAdornment>
                ),
              },
            }}
          />

          <TextField
            select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            sx={{ width: { xs: '100%', md: 220 } }}
          >
            <MenuItem value="all">All categories</MenuItem>
            {categories.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Level"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            sx={{ width: { xs: '100%', md: 180 } }}
          >
            <MenuItem value="all">All levels</MenuItem>
            {levels.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </TextField>
        </Stack>

        <Typography
          sx={{
            color: '#536A7B',
            mb: 2.5,
            fontWeight: 600,
          }}
        >
          {loading
            ? 'Loading learning programmes...'
            : `${filteredCourses.length} learning programme${
                filteredCourses.length === 1 ? '' : 's'
              }`}
        </Typography>

        {!loading && filteredCourses.length === 0 && (
          <Box
            sx={{
              py: 8,
              textAlign: 'center',
              border: '1px dashed #C9D8E3',
              borderRadius: 2,
              bgcolor: '#fff',
            }}
          >
            <Typography sx={{ color: '#536A7B', fontWeight: 600 }}>
              No courses found
            </Typography>
            <Typography sx={{ color: '#80909D', mt: 0.5 }}>
              Try a different search term or filter.
            </Typography>
          </Box>
        )}

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)',
            },
            gap: { xs: 2, md: 2.5 },
          }}
        >
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              courseId={String(course.id)}
              category={course.category ?? 'Learning Programme'}
              title={course.title ?? 'Untitled Course'}
              description={
                course.description ??
                'Structured learning programme available through Capacity Connect.'
              }
              duration={
                course.duration ??
                (course.durationHours
                  ? `${course.durationHours} Hours`
                  : 'Self-paced')
              }
              level={course.level ?? 'General'}
            />
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Courses;
