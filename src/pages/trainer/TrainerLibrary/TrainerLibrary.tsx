import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import {
  deleteTrainerResource,
  getTrainerResourceCourses,
  getTrainerResources,
  downloadTrainerResource,
} from '../../../services/api';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';

interface Resource {
  id: number;
  trainerId: number;
  courseId: number | null;
  title: string;
  description: string | null;
  resourceType: string;
  fileName: string;
  fileType: string | null;
  fileSize: number | null;
  active: boolean;
  createdAt: string;
}

interface Course {
  id: number;
  title: string;
}

const API = import.meta.env.VITE_API_BASE_URL || '';

const TrainerLibrary = () => {
  const { user } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [courseId, setCourseId] = useState('');
  const [resourceType, setResourceType] = useState('STUDY_MATERIAL');
  const [file, setFile] = useState<File | null>(null);

  const loadResources = async () => {
    if (!user?.id) return;

    try {
      const data = await getTrainerResources(user.id);
      setResources(data);
    } catch {
      setMessage('Unable to load trainer resources.');
    }
  };

  const loadCourses = async () => {
    if (!user?.id) return;

    try {
      const data = await getTrainerResourceCourses(user.id);
      setCourses(data);
    } catch {
      setMessage('Unable to load courses.');
    }
  };

  useEffect(() => {
    if (!user?.id) return;

    loadResources();
    loadCourses();
  }, [user?.id]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCourseId('');
    setResourceType('STUDY_MATERIAL');
    setFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    if (!title.trim() || !file) {
      setMessage('Title and file are required.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const formData = new FormData();

      if (!user?.id) {
        throw new Error('Authenticated trainer not found.');
      }

      formData.append('trainerId', String(user.id));

      if (courseId) {
        formData.append('courseId', courseId);
      }

      formData.append('title', title);
      formData.append('description', description);
      formData.append('resourceType', resourceType);
      formData.append('file', file);

      const response = await fetch(
        `${API}/api/trainer-resources/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      setOpen(false);
      resetForm();
      await loadResources();
      setMessage('Resource uploaded successfully.');
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Upload failed.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (resource: Resource) => {
    try {
      const blob = await downloadTrainerResource(resource.id);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.download = resource.fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch {
      setMessage('Unable to download resource.');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTrainerResource(id);
      await loadResources();
      setMessage('Resource removed.');
    } catch {
      setMessage('Unable to remove resource.');
    }
  };

  const formatSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown size';

    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const courseName = (id: number | null) => {
    if (!id) return 'General Library';

    return courses.find((course) => course.id === id)?.title
      || `Course #${id}`;
  };

  return (
    <Box sx={{ bgcolor: '#F5F8FA', minHeight: '100vh' }}>
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          sx={{
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            gap: 2,
            mb: 4,
          }}
        >
          <Box>
            <Typography
              sx={{
                color: '#0B5A91',
                fontWeight: 700,
                fontSize: '0.82rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              Trainer Portal
            </Typography>

            <Typography
              sx={{
                color: '#173F60',
                fontWeight: 800,
                fontSize: { xs: '2rem', md: '2.6rem' },
                mt: 0.5,
              }}
            >
              Trainer Library
            </Typography>

            <Typography sx={{ color: '#657887', mt: 1 }}>
              Upload and manage lectures, presentations and study materials.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<CloudUploadOutlinedIcon />}
            onClick={() => setOpen(true)}
            sx={{
              bgcolor: '#0B5A91',
              textTransform: 'none',
              fontWeight: 700,
              px: 2.5,
              '&:hover': { bgcolor: '#084A78' },
            }}
          >
            Upload Resource
          </Button>
        </Stack>

        {message && (
          <Card
            elevation={0}
            sx={{
              mb: 3,
              border: '1px solid #DCE8F0',
              borderRadius: 2,
            }}
          >
            <CardContent sx={{ py: 1.5 }}>
              <Typography sx={{ color: '#526B7A' }}>
                {message}
              </Typography>
            </CardContent>
          </Card>
        )}

        <Typography
          sx={{
            color: '#173F60',
            fontWeight: 800,
            fontSize: '1.2rem',
            mb: 1.5,
          }}
        >
          Library Resources
        </Typography>

        {resources.length === 0 ? (
          <Card
            elevation={0}
            sx={{
              border: '1px solid #DCE8F0',
              borderRadius: 2,
            }}
          >
            <CardContent sx={{ py: 6, textAlign: 'center' }}>
              <InsertDriveFileOutlinedIcon
                sx={{ fontSize: 48, color: '#9AAEBB', mb: 1 }}
              />
              <Typography sx={{ color: '#526B7A', fontWeight: 600 }}>
                No resources uploaded yet.
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)',
              },
              gap: 2.5,
            }}
          >
            {resources.map((resource) => (
              <Card
                key={resource.id}
                elevation={0}
                sx={{
                  border: '1px solid #DCE8F0',
                  borderRadius: 2,
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <Stack
                    direction="row"
                    sx={{
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: 1.5,
                    }}
                  >
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
                      <InsertDriveFileOutlinedIcon
                        sx={{ color: '#0B5A91' }}
                      />
                    </Box>

                    <Chip
                      label={resource.resourceType.replace('_', ' ')}
                      size="small"
                      sx={{
                        bgcolor: '#EAF4FB',
                        color: '#0B5A91',
                        fontWeight: 700,
                      }}
                    />
                  </Stack>

                  <Typography
                    sx={{
                      color: '#173F60',
                      fontWeight: 700,
                      fontSize: '1.05rem',
                      mt: 2,
                    }}
                  >
                    {resource.title}
                  </Typography>

                  <Typography
                    sx={{
                      color: '#718594',
                      fontSize: '0.9rem',
                      mt: 0.8,
                    }}
                  >
                    {courseName(resource.courseId)}
                  </Typography>

                  <Typography
                    sx={{
                      color: '#657887',
                      fontSize: '0.9rem',
                      mt: 1.5,
                      minHeight: 42,
                    }}
                  >
                    {resource.description || 'No description provided.'}
                  </Typography>

                  <Typography
                    sx={{
                      color: '#718594',
                      fontSize: '0.82rem',
                      mt: 1.5,
                    }}
                  >
                    {resource.fileName} • {formatSize(resource.fileSize)}
                  </Typography>

                  <Stack
                    direction="row"
                    sx={{ gap: 1, mt: 2.5 }}
                  >
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<DownloadOutlinedIcon />}
                      onClick={() => handleDownload(resource)}
                      sx={{
                        color: '#0B5A91',
                        borderColor: '#BCD2E2',
                        textTransform: 'none',
                        fontWeight: 700,
                      }}
                    >
                      Download
                    </Button>

                    <Button
                      variant="outlined"
                      onClick={() => handleDelete(resource.id)}
                      sx={{
                        minWidth: 48,
                        color: '#A33A3A',
                        borderColor: '#E2C4C4',
                      }}
                    >
                      <DeleteOutlineOutlinedIcon />
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Container>

      <Dialog
        open={open}
        onClose={() => !loading && setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{ color: '#173F60', fontWeight: 800 }}
        >
          Upload Resource
        </DialogTitle>

        <DialogContent>
          <Stack sx={{ gap: 2.2, pt: 1 }}>
            <TextField
              label="Resource Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              required
            />

            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              rows={3}
            />

            <TextField
              select
              label="Course"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              fullWidth
            >
              <MenuItem value="">General Library</MenuItem>
              {courses.map((course) => (
                <MenuItem key={course.id} value={course.id}>
                  {course.title}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Resource Type"
              value={resourceType}
              onChange={(e) => setResourceType(e.target.value)}
              fullWidth
            >
              <MenuItem value="LECTURE">Recorded Lecture</MenuItem>
              <MenuItem value="PRESENTATION">Presentation</MenuItem>
              <MenuItem value="STUDY_MATERIAL">Study Material</MenuItem>
            </TextField>

            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUploadOutlinedIcon />}
              sx={{
                minHeight: 52,
                borderColor: '#BCD2E2',
                color: '#0B5A91',
                textTransform: 'none',
                fontWeight: 700,
              }}
            >
              {file ? file.name : 'Choose File'}
              <input
                ref={fileInputRef}
                hidden
                type="file"
                accept=".pdf,.ppt,.pptx,.doc,.docx,.txt,.mp4"
                onChange={(e) =>
                  setFile(e.target.files?.[0] || null)
                }
              />
            </Button>

            <Typography sx={{ color: '#718594', fontSize: '0.8rem' }}>
              Allowed: PDF, PPT, PPTX, DOC, DOCX, TXT, MP4 • Maximum 10 MB
            </Typography>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2.5 }}>
          <Button
            onClick={() => setOpen(false)}
            disabled={loading}
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={loading}
            sx={{
              bgcolor: '#0B5A91',
              textTransform: 'none',
              fontWeight: 700,
            }}
          >
            {loading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TrainerLibrary;
