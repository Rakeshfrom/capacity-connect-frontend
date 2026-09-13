import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DragIndicatorOutlinedIcon from '@mui/icons-material/DragIndicatorOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import PublishOutlinedIcon from '@mui/icons-material/PublishOutlined';

import { useNavigate, useParams } from 'react-router-dom';

import {
  createCourseModule,
  deleteCourseModule,
  getCourseById,
  getCourseModules,
  updateCourse,
  updateCourseModule,
} from '../../../../services/api';

type Course = {
  id: number;
  title: string;
  description?: string;
  category?: string;
  durationHours?: number;
  level?: string;
  status?: string;
};

type CourseModule = {
  id: number;
  courseId: number;
  title: string;
  description?: string;
  orderIndex: number;
  active: boolean;
};




const CourseBuilder = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();

  const id = Number(courseId);

  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const [moduleDialog, setModuleDialog] = useState(false);
  const [editingModule, setEditingModule] = useState<CourseModule | null>(null);

  const [moduleTitle, setModuleTitle] = useState('');
  const [moduleDescription, setModuleDescription] = useState('');


  const load = async () => {
    if (!id) return;

    try {
      const [courseData, moduleData] = await Promise.all([
        getCourseById(id),
        getCourseModules(id),
      ]);

      setCourse(courseData);

      const activeModules = (moduleData ?? []).filter(
        (item: CourseModule) => item.active
      );

      setModules(activeModules);

      if (
        selectedModuleId === null &&
        activeModules.length > 0
      ) {
        setSelectedModuleId(activeModules[0].id);
      }
    } catch (err) {
      console.error(err);
      setError('Unable to load the course builder.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const openCreateModule = () => {
    setEditingModule(null);
    setModuleTitle('');
    setModuleDescription('');
    setModuleDialog(true);
  };

  const openEditModule = (module: CourseModule) => {
    setEditingModule(module);
    setModuleTitle(module.title);
    setModuleDescription(module.description ?? '');
    setModuleDialog(true);
  };

  const saveModule = async () => {
    if (!moduleTitle.trim()) return;

    setSaving(true);
    setError('');

    try {
      if (editingModule) {
        await updateCourseModule(editingModule.id, {
          title: moduleTitle.trim(),
          description: moduleDescription.trim(),
          orderIndex: editingModule.orderIndex,
        });
      } else {
        await createCourseModule(id, {
          title: moduleTitle.trim(),
          description: moduleDescription.trim(),
          orderIndex: modules.length,
        });
      }

      setModuleDialog(false);
      await load();
    } catch (err) {
      console.error(err);
      setError('Unable to save the module.');
    } finally {
      setSaving(false);
    }
  };

  const saveCourseChanges = async () => {
    if (!course) return;

    try {
      setSaving(true);
      setError('');

      const updated = await updateCourse(course.id, {
        title: course.title,
        description: course.description ?? '',
        category: course.category ?? '',
        durationHours: course.durationHours ?? 0,
        level: course.level ?? 'BEGINNER',
        status: course.status ?? 'DRAFT',
      });

      setCourse(updated);
      setSaved(true);

      window.setTimeout(() => {
        setSaved(false);
      }, 1800);
    } catch (err) {
      console.error(err);
      setError('Unable to save course changes.');
    } finally {
      setSaving(false);
    }
  };

  const previewCourse = () => {
    if (!course) return;

    window.open(
      `${window.location.origin}/courses/${course.id}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const publishCourse = async () => {
    if (!course) return;

    if (modules.length === 0) {
      setError(
        'Add at least one module before publishing this course.'
      );
      return;
    }

    if (
      !window.confirm(
        'Publish this course? It will become available to trainees.'
      )
    ) {
      return;
    }

    try {
      setPublishing(true);
      setError('');

      const updated = await updateCourse(
        course.id,
        {
          title: course.title,
          description: course.description ?? '',
          category: course.category ?? '',
          durationHours: course.durationHours ?? 0,
          level: course.level ?? 'BEGINNER',
          status: 'PUBLISHED',
        }
      );

      setCourse(updated);
    } catch (err) {
      console.error(err);
      setError(
        'Unable to publish this course. Please try again.'
      );
    } finally {
      setPublishing(false);
    }
  };

  const removeModule = async (module: CourseModule) => {
    if (!window.confirm(`Remove "${module.title}" from this course?`)) {
      return;
    }

    try {
      await deleteCourseModule(module.id);

      if (selectedModuleId === module.id) {
        setSelectedModuleId(null);
      }

      await load();
    } catch (err) {
      console.error(err);
      setError('Unable to remove the module.');
    }
  };



  const selectedModule =
    modules.find((item) => item.id === selectedModuleId) ?? null;

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!course) {
    return (
      <Box sx={{ bgcolor: '#F5F8FA', minHeight: '100vh', p: 4 }}>
        <Button
          startIcon={<ArrowBackOutlinedIcon />}
          onClick={() => navigate('/trainer/courses')}
          sx={{ textTransform: 'none' }}
        >
          Back to My Courses
        </Button>

        <Alert severity="error" sx={{ mt: 3 }}>
          {error || 'Course not found.'}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#F5F8FA', minHeight: '100vh' }}>
      <Box
        sx={{
          bgcolor: '#FFFFFF',
          borderBottom: '1px solid #DCE8F0',
          position: 'sticky',
          top: 0,
          zIndex: 5,
        }}
      >
        <Box
          sx={{
            maxWidth: 1500,
            mx: 'auto',
            px: { xs: 2, md: 4 },
            py: 1.5,
          }}
        >
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            sx={{
              justifyContent: 'space-between',
              alignItems: { xs: 'stretch', md: 'center' },
              gap: 1.5,
            }}
          >
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              <IconButton
                onClick={() => navigate('/trainer/courses')}
                sx={{ border: '1px solid #DCE8F0' }}
              >
                <ArrowBackOutlinedIcon />
              </IconButton>

              <Box sx={{ minWidth: 0 }}>
                <Typography
                  sx={{
                    color: '#718594',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  Trainer Portal · Course Builder
                </Typography>

                <Typography
                  sx={{
                    color: '#173F60',
                    fontWeight: 800,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {course.title}
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1}>
              <Button
                startIcon={<SaveOutlinedIcon />}
                variant="outlined"
                onClick={saveCourseChanges}
                disabled={saving || publishing}
                sx={{
                  textTransform: 'none',
                  borderColor: '#BCD2E2',
                  color: '#0B5A91',
                }}
              >
                {saving ? 'Saving...' : saved ? 'Saved' : 'Save'}
              </Button>

              <Button
                startIcon={<VisibilityOutlinedIcon />}
                variant="outlined"
                onClick={previewCourse}
                disabled={saving || publishing}
                sx={{
                  textTransform: 'none',
                  borderColor: '#BCD2E2',
                  color: '#0B5A91',
                }}
              >
                Preview
              </Button>

              <Button
                startIcon={<PublishOutlinedIcon />}
                variant="contained"
                onClick={publishCourse}
                disabled={
                  saving ||
                  publishing ||
                  course.status === 'PUBLISHED'
                }
                sx={{
                  textTransform: 'none',
                  bgcolor: '#0B5A91',
                  '&:hover': { bgcolor: '#084873' },
                }}
              >
                {publishing
                  ? 'Publishing...'
                  : course.status === 'PUBLISHED'
                    ? 'Published'
                    : 'Publish'}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Box>

      <Box
        sx={{
          maxWidth: 1500,
          mx: 'auto',
          px: { xs: 2, md: 4 },
          py: 3,
        }}
      >
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              lg: '320px minmax(0, 1fr)',
            },
            gap: 2.5,
          }}
        >
          <Card
            elevation={0}
            sx={{
              border: '1px solid #DCE8F0',
              borderRadius: 2,
              alignSelf: 'start',
              position: { lg: 'sticky' },
              top: { lg: 88 },
            }}
          >
            <CardContent sx={{ p: 2 }}>
              <Stack
                direction="row"
                sx={{
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 1.5,
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      color: '#173F60',
                      fontWeight: 800,
                    }}
                  >
                    Course Content
                  </Typography>

                  <Typography
                    sx={{
                      color: '#718594',
                      fontSize: '0.82rem',
                      mt: 0.3,
                    }}
                  >
                    {modules.length} module
                    {modules.length === 1 ? '' : 's'}
                  </Typography>
                </Box>

                <IconButton
                  onClick={openCreateModule}
                  size="small"
                  sx={{
                    bgcolor: '#EAF4FB',
                    color: '#0B5A91',
                  }}
                >
                  <AddOutlinedIcon fontSize="small" />
                </IconButton>
              </Stack>

              <Divider sx={{ mb: 1 }} />

              {modules.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 5, px: 1 }}>
                  <MenuBookOutlinedIcon />

                  <Typography
                    sx={{
                      color: '#173F60',
                      fontWeight: 700,
                      mt: 1,
                    }}
                  >
                    Start with a module
                  </Typography>

                  <Typography
                    sx={{
                      color: '#718594',
                      fontSize: '0.85rem',
                      mt: 0.6,
                    }}
                  >
                    Organise your training content into clear
                    learning sections.
                  </Typography>

                  <Button
                    startIcon={<AddOutlinedIcon />}
                    onClick={openCreateModule}
                    sx={{
                      mt: 2,
                      textTransform: 'none',
                      fontWeight: 700,
                      color: '#0B5A91',
                    }}
                  >
                    Add Module
                  </Button>
                </Box>
              ) : (
                <Stack spacing={0.75}>
                  {modules.map((module, index) => (
                    <Box
                      key={module.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'stretch',
                        gap: 0.5,
                      }}
                    >
                      <Button
                        onClick={() => {
                          setSelectedModuleId(module.id);
                                              }}
                        sx={{
                          flex: 1,
                          justifyContent: 'flex-start',
                          textAlign: 'left',
                          textTransform: 'none',
                          borderRadius: 1.5,
                          px: 1,
                          py: 1.2,
                          bgcolor:
                            selectedModuleId === module.id
                              ? '#EAF4FB'
                              : 'transparent',
                          color: '#173F60',
                          '&:hover': {
                            bgcolor: '#F3F8FC',
                          },
                        }}
                      >
                        <DragIndicatorOutlinedIcon
                          sx={{
                            color: '#A2B2BC',
                            mr: 0.5,
                          }}
                          fontSize="small"
                        />

                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            sx={{
                              fontSize: '0.72rem',
                              color: '#718594',
                              fontWeight: 700,
                            }}
                          >
                            MODULE {index + 1}
                          </Typography>

                          <Typography
                            sx={{
                              fontWeight: 700,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {module.title}
                          </Typography>
                        </Box>
                      </Button>

                      <IconButton
                        size="small"
                        onClick={() => openEditModule(module)}
                        sx={{
                          alignSelf: 'center',
                          color: '#718594',
                        }}
                      >
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>

                      <IconButton
                        size="small"
                        onClick={() => removeModule(module)}
                        sx={{
                          alignSelf: 'center',
                          color: '#A94442',
                        }}
                      >
                        <DeleteOutlineOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}

                  <Button
                    startIcon={<AddOutlinedIcon />}
                    onClick={openCreateModule}
                    sx={{
                      justifyContent: 'flex-start',
                      textTransform: 'none',
                      mt: 0.5,
                      color: '#0B5A91',
                      fontWeight: 700,
                    }}
                  >
                    Add Module
                  </Button>
                </Stack>
              )}
            </CardContent>
          </Card>

          <Box>
            {selectedModule ? (
              <Stack spacing={2.5}>
                <Card
                  elevation={0}
                  sx={{
                    border: '1px solid #DCE8F0',
                    borderRadius: 2,
                  }}
                >
                  <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      sx={{
                        justifyContent: 'space-between',
                        alignItems: {
                          xs: 'flex-start',
                          sm: 'center',
                        },
                        gap: 2,
                      }}
                    >
                      <Box>
                        <Typography
                          sx={{
                            color: '#718594',
                            fontSize: '0.76rem',
                            fontWeight: 700,
                            letterSpacing: '0.08em',
                          }}
                        >
                          SELECTED MODULE
                        </Typography>

                        <Typography
                          sx={{
                            color: '#173F60',
                            fontSize: '1.55rem',
                            fontWeight: 800,
                            mt: 0.4,
                          }}
                        >
                          {selectedModule.title}
                        </Typography>

                        <Typography
                          sx={{
                            color: '#657887',
                            mt: 0.8,
                            lineHeight: 1.6,
                          }}
                        >
                          {selectedModule.description ||
                            'Add a short module summary to help learners understand what this section covers.'}
                        </Typography>
                      </Box>

                      <Button
                        startIcon={<EditOutlinedIcon />}
                        onClick={() => openEditModule(selectedModule)}
                        sx={{
                          textTransform: 'none',
                          color: '#0B5A91',
                          fontWeight: 700,
                        }}
                      >
                        Edit Module
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>

                  <Card>
                          <CardContent>
                            {selectedModule ? (
                              <ModuleContentPanel
                                courseId={id}
                                moduleId={selectedModule.id}
                              />
                            ) : (
                              <Box sx={{ py: 6, textAlign: 'center' }}>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                  Select a module
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ mt: 0.5 }}
                                >
                                  Select a module to manage its learning content.
                                </Typography>
                              </Box>
                            )}
                          </CardContent>
                        </Card>

              </Stack>
            ) : (
              <Card
                elevation={0}
                sx={{
                  border: '1px solid #DCE8F0',
                  borderRadius: 2,
                }}
              >
                <CardContent
                  sx={{
                    py: 10,
                    textAlign: 'center',
                  }}
                >
                  <MenuBookOutlinedIcon
                    sx={{
                      fontSize: 52,
                      color: '#A2B2BC',
                    }}
                  />

                  <Typography
                    sx={{
                      color: '#173F60',
                      fontWeight: 800,
                      fontSize: '1.2rem',
                      mt: 1.5,
                    }}
                  >
                    Build your course structure
                  </Typography>

                  <Typography
                    sx={{
                      color: '#718594',
                      mt: 0.7,
                    }}
                  >
                    Create your first module from the left panel.
                  </Typography>

                  <Button
                    variant="contained"
                    startIcon={<AddOutlinedIcon />}
                    onClick={openCreateModule}
                    sx={{
                      mt: 2.5,
                      textTransform: 'none',
                      bgcolor: '#0B5A91',
                    }}
                  >
                    Add First Module
                  </Button>
                </CardContent>
              </Card>
            )}
          </Box>
        </Box>
      </Box>

      <Dialog
        open={moduleDialog}
        onClose={() => !saving && setModuleDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            color: '#173F60',
            fontWeight: 800,
          }}
        >
          {editingModule ? 'Edit Module' : 'Add Module'}
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2.2} sx={{ pt: 1 }}>
            <TextField
              label="Module Title"
              required
              fullWidth
              value={moduleTitle}
              onChange={(e) => setModuleTitle(e.target.value)}
              autoFocus
            />

            <TextField
              label="Module Summary"
              fullWidth
              multiline
              minRows={4}
              value={moduleDescription}
              onChange={(e) =>
                setModuleDescription(e.target.value)
              }
              helperText="Optional. This appears at the top of the module for learners."
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button
            onClick={() => setModuleDialog(false)}
            disabled={saving}
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>

          <Button
            onClick={saveModule}
            disabled={saving || !moduleTitle.trim()}
            variant="contained"
            sx={{
              textTransform: 'none',
              bgcolor: '#0B5A91',
              '&:hover': {
                bgcolor: '#084873',
              },
            }}
          >
            {saving
              ? 'Saving...'
              : editingModule
                ? 'Save Changes'
                : 'Add Module'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CourseBuilder;
import ModuleContentPanel from './ModuleContentPanel';
