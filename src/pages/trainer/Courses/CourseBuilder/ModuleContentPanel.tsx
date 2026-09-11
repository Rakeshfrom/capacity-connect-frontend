import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined';

import {
  deleteTrainerResource,
  getAssessmentsByCourse,
  getCourseResources,
  getCurrentUser,
  uploadCourseResource,
} from '../../../../services/api';
import AssessmentBuilder from './AssessmentBuilder';

type Resource = {
  id: number;
  moduleId?: number;
  title: string;
  description?: string;
  resourceType: string;
};

type Assessment = {
  id: number;
  courseId: number;
  moduleId?: number;
  title: string;
  description?: string;
  timeLimitMinutes?: number;
  passingPercentage?: number;
};

type Props = {
  courseId: number;
  moduleId: number;
};

const ModuleContentPanel: React.FC<Props> = ({ courseId, moduleId }) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [assessmentOpen, setAssessmentOpen] = useState(false);
  const [resourceType, setResourceType] = useState('STUDY_MATERIAL');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const loadContent = async () => {
    try {
      const [resourceData, assessmentData] = await Promise.all([
        getCourseResources(courseId),
        getAssessmentsByCourse(courseId),
      ]);

      const moduleResources = (resourceData || []).filter(
        (item: Resource) => Number(item.moduleId) === Number(moduleId)
      );

      const moduleAssessments = (assessmentData || []).filter(
        (item: Assessment) => Number(item.moduleId) === Number(moduleId)
      );

      setResources(moduleResources);
      setAssessments(moduleAssessments);
    } catch (error) {
      console.error(error);
      setMessage('Failed to load module content.');
    }
  };

  useEffect(() => {
    loadContent();
  }, [courseId, moduleId]);

  const openMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const openUpload = (type: string) => {
    setResourceType(type);
    setTitle('');
    setDescription('');
    setFile(null);
    setMessage('');
    closeMenu();
    setUploadOpen(true);
  };

  const upload = async () => {
    if (!title.trim() || !file) {
      setMessage('Title and file are required.');
      return;
    }

    try {
      setLoading(true);
      setMessage('');

      const user = await getCurrentUser();

      await uploadCourseResource({
        trainerId: Number(user.id),
        courseId,
        moduleId,
        title: title.trim(),
        description: description.trim(),
        resourceType,
        file,
      });

      setUploadOpen(false);
      await loadContent();
    } catch (error) {
      console.error(error);
      setMessage('Failed to upload content.');
    } finally {
      setLoading(false);
    }
  };

  const deleteResource = async (id: number) => {
    try {
      await deleteTrainerResource(id);
      await loadContent();
    } catch (error) {
      console.error(error);
      setMessage('Failed to delete content.');
    }
  };

  const resourceLabel = (type: string) => {
    if (type === 'LECTURE') return 'Recorded Lecture';
    if (type === 'PRESENTATION') return 'Presentation';
    return 'Study Material';
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack
          direction="row"
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Learning Content
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Add resources and assessments to this module.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openMenu}
          >
            Add Content
          </Button>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={closeMenu}
            sx={{
              '& .MuiPaper-root': {
                mt: 1,
                minWidth: 240,
              },
            }}
          >
            <MenuItem onClick={() => openUpload('STUDY_MATERIAL')}>
              Study Material
            </MenuItem>

            <MenuItem onClick={() => openUpload('LECTURE')}>
              Recorded Lecture
            </MenuItem>

            <MenuItem onClick={() => openUpload('PRESENTATION')}>
              Presentation
            </MenuItem>

            <MenuItem
              onClick={() => {
                closeMenu();
                setAssessmentOpen(true);
              }}
            >
              <QuizOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
              Assessment
            </MenuItem>
          </Menu>
        </Stack>

        {message && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}

        {resources.length === 0 && assessments.length === 0 ? (
          <Box
            sx={{
              py: 6,
              textAlign: 'center',
              border: '1px dashed',
              borderColor: 'divider',
              borderRadius: 2,
            }}
          >
            <Typography sx={{ fontWeight: 600 }}>
              No learning content yet
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
              Add study material, lectures, presentations or an assessment.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={1.5}>
            {resources.map((resource) => (
              <Card key={`resource-${resource.id}`} variant="outlined">
                <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                  <Stack
                    direction="row"
                    sx={{
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 2,
                    }}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                        <Typography sx={{ fontWeight: 600 }} noWrap>
                          {resource.title}
                        </Typography>
                        <Chip
                          size="small"
                          label={resourceLabel(resource.resourceType)}
                        />
                      </Stack>

                      {resource.description && (
                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary", mt: 0.5 }}
                        >
                          {resource.description}
                        </Typography>
                      )}
                    </Box>

                    <IconButton onClick={() => deleteResource(resource.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </CardContent>
              </Card>
            ))}

            {assessments.map((assessment) => (
              <Card key={`assessment-${assessment.id}`} variant="outlined">
                <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                  <Stack
                    direction="row"
                    sx={{
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 2,
                    }}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                        <QuizOutlinedIcon fontSize="small" />
                        <Typography sx={{ fontWeight: 600 }} noWrap>
                          {assessment.title}
                        </Typography>
                        <Chip size="small" label="Assessment" />
                      </Stack>

                      {assessment.description && (
                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary", mt: 0.5 }}
                        >
                          {assessment.description}
                        </Typography>
                      )}
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </CardContent>

      <Dialog
        open={uploadOpen}
        onClose={() => !loading && setUploadOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add Learning Content</DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
            />

            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={3}
              fullWidth
            />

            <Button variant="outlined" component="label">
              {file ? file.name : 'Choose File'}
              <input
                hidden
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </Button>

            <Button
              variant="contained"
              onClick={upload}
              disabled={loading}
            >
              {loading ? 'Uploading...' : 'Upload'}
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>

      <Dialog
        open={assessmentOpen}
        onClose={() => setAssessmentOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Create Assessment</DialogTitle>

        <DialogContent>
          <AssessmentBuilder
            courseId={courseId}
            moduleId={moduleId}
            onSaved={async () => {
              setAssessmentOpen(false);
              await loadContent();
            }}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ModuleContentPanel;
