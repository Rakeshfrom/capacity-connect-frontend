import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';

import { downloadTrainerResource } from '../../services/api';

import {
  getResourceLearningPoint,
  saveResourceLearningPoint,
} from '../../services/learningResume';

interface LessonResource {
  id: number;
  courseId?: number;
  moduleId?: number;
  title: string;
  description?: string | null;
  resourceType: string;
  fileName?: string | null;
  fileType?: string | null;
}

interface LessonViewerProps {
  resource: LessonResource;
  courseId: number;
  moduleId?: number | null;
  onClose: () => void;
}

const getExtension = (fileName?: string | null) => {
  const value = String(fileName || '').toLowerCase();

  return value.includes('.')
    ? value.split('.').pop() || ''
    : '';
};

const getKind = (
  resource: LessonResource
) => {
  const value =
    `${resource.resourceType} ${resource.fileType || ''} ${resource.fileName || ''}`
      .toLowerCase();

  const ext = getExtension(resource.fileName);

  if (
    value.includes('video') ||
    value.includes('mp4') ||
    value.includes('webm') ||
    ['mp4', 'webm', 'ogg', 'mov'].includes(ext)
  ) {
    return 'video' as const;
  }

  if (
    value.includes('pdf') ||
    ext === 'pdf'
  ) {
    return 'pdf' as const;
  }

  if (
    value.includes('text') ||
    ext === 'txt'
  ) {
    return 'text' as const;
  }

  if (
    value.includes('image') ||
    ['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(ext)
  ) {
    return 'image' as const;
  }

  return 'document' as const;
};

const formatTime = (seconds: number) => {
  const safe = Math.max(0, Math.floor(seconds || 0));

  const minutes = Math.floor(safe / 60);
  const secondsPart = safe % 60;

  return `${String(minutes).padStart(2, '0')}:${String(
    secondsPart
  ).padStart(2, '0')}`;
};

const LessonViewer = ({
  resource,
  courseId,
  moduleId,
  onClose,
}: LessonViewerProps) => {
  const kind = useMemo(
    () => getKind(resource),
    [resource]
  );

  const savedPoint = useMemo(
    () =>
      getResourceLearningPoint(
        courseId,
        resource.id
      ),
    [courseId, resource.id]
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [blobUrl, setBlobUrl] = useState('');
  const [textContent, setTextContent] = useState('');
  const [pdfPage, setPdfPage] = useState(
    Math.max(1, savedPoint?.pageNumber || 1)
  );

  const videoRef = useRef<HTMLVideoElement | null>(
    null
  );

  const lastSavedAt = useRef(0);

  useEffect(() => {
    let active = true;
    let objectUrl = '';

    const loadResource = async () => {
      try {
        setLoading(true);
        setError('');

        const blob =
          await downloadTrainerResource(resource.id);

        objectUrl = URL.createObjectURL(blob);

        if (!active) return;

        setBlobUrl(objectUrl);

        if (kind === 'text') {
          const text = await blob.text();

          if (active) {
            setTextContent(text);
          }
        }

        if (kind === 'pdf') {
          setPdfPage(
            Math.max(
              1,
              savedPoint?.pageNumber || 1
            )
          );
        }
      } catch (err) {
        console.error(
          'Failed to open learning resource:',
          err
        );

        if (active) {
          setError(
            'Unable to open this learning material.'
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadResource();

    return () => {
      active = false;

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [
    kind,
    resource.id,
    savedPoint?.pageNumber,
  ]);

  const saveVideoProgress = (
    force = false
  ) => {
    const video = videoRef.current;

    if (!video) return;

    const now = Date.now();

    if (
      !force &&
      now - lastSavedAt.current < 2500
    ) {
      return;
    }

    lastSavedAt.current = now;

    const currentTime =
      video.currentTime || 0;

    const duration =
      video.duration || 0;

    const completed =
      duration > 0 &&
      currentTime >= Math.max(
        0,
        duration - 2
      );

    saveResourceLearningPoint({
      courseId,
      resourceId: resource.id,
      moduleId,
      resourceTitle: resource.title,
      positionSeconds:
        completed ? 0 : currentTime,
      completed,
    });
  };

  const restoreVideoPosition = () => {
    const video = videoRef.current;

    if (!video) return;

    const saved =
      savedPoint?.positionSeconds || 0;

    if (
      saved <= 0 ||
      !Number.isFinite(saved)
    ) {
      return;
    }

    const duration =
      video.duration || 0;

    if (
      duration > 0 &&
      saved < duration - 2
    ) {
      video.currentTime = saved;
    }
  };

  const handleVideoEnded = () => {
    saveResourceLearningPoint({
      courseId,
      resourceId: resource.id,
      moduleId,
      resourceTitle: resource.title,
      positionSeconds: 0,
      completed: true,
    });
  };

  const savePdfPage = () => {
    const safePage = Math.max(
      1,
      Math.floor(Number(pdfPage) || 1)
    );

    setPdfPage(safePage);

    saveResourceLearningPoint({
      courseId,
      resourceId: resource.id,
      moduleId,
      resourceTitle: resource.title,
      positionSeconds: 0,
      pageNumber: safePage,
      completed: false,
    });
  };

  useEffect(() => {
    const handleUnload = () => {
      if (kind === 'video') {
        saveVideoProgress(true);
      }
    };

    window.addEventListener(
      'beforeunload',
      handleUnload
    );

    return () =>
      window.removeEventListener(
        'beforeunload',
        handleUnload
      );
  }, [kind]);

  const handleDownload = async () => {
    try {
      const blob =
        await downloadTrainerResource(resource.id);

      const url =
        URL.createObjectURL(blob);

      const anchor =
        document.createElement('a');

      anchor.href = url;
      anchor.download =
        resource.fileName ||
        'course-resource';

      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(
        'Resource download failed:',
        err
      );

      setError(
        'Unable to download this resource.'
      );
    }
  };

  const savedTime =
    savedPoint?.positionSeconds || 0;

  return (
    <Dialog
      open
      onClose={onClose}
      fullWidth
      maxWidth="lg"
    >
      <DialogTitle
        sx={{
          px: { xs: 2, md: 3 },
          py: 1.8,
          borderBottom:
            '1px solid #E1E9EE',
        }}
      >
        <Stack
          direction="row"
          spacing={1.5}
          sx={{
            justifyContent:
              'space-between',
            alignItems: 'center',
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                color: '#173F60',
                fontWeight: 800,
                fontSize: '1.05rem',
              }}
            >
              {resource.title}
            </Typography>

            <Typography
              sx={{
                mt: .2,
                color: '#81909B',
                fontSize: '.74rem',
              }}
            >
              {resource.fileName ||
                resource.resourceType}
            </Typography>
          </Box>

          <IconButton onClick={onClose}>
            <CloseRoundedIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent
        sx={{
          p: 0,
          bgcolor: '#F4F8FB',
        }}
      >
        {loading && (
          <Box
            sx={{
              minHeight: 420,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection:
                'column',
              gap: 1.5,
            }}
          >
            <CircularProgress
              sx={{
                color: '#0B5A91',
              }}
            />

            <Typography
              sx={{
                color: '#657887',
                fontSize: '.82rem',
              }}
            >
              Opening learning material...
            </Typography>
          </Box>
        )}

        {!loading && error && (
          <Box sx={{ p: 3 }}>
            <Alert severity="error">
              {error}
            </Alert>
          </Box>
        )}

        {!loading &&
          !error &&
          kind === 'video' && (
            <Box>
              <Box
                sx={{
                  bgcolor: '#0B1C29',
                  minHeight: {
                    xs: 240,
                    md: 520,
                  },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent:
                    'center',
                }}
              >
                <video
                  ref={videoRef}
                  src={blobUrl}
                  controls
                  playsInline
                  preload="metadata"
                  onLoadedMetadata={
                    restoreVideoPosition
                  }
                  onTimeUpdate={() =>
                    saveVideoProgress(false)
                  }
                  onPause={() =>
                    saveVideoProgress(true)
                  }
                  onEnded={handleVideoEnded}
                  style={{
                    width: '100%',
                    maxHeight: '70vh',
                    display: 'block',
                  }}
                />
              </Box>

              <Box
                sx={{
                  p: {
                    xs: 2,
                    md: 2.4,
                  },
                }}
              >
                <Stack spacing={1}>
                  {savedTime > 0 && (
                    <Typography
                      sx={{
                        color: '#657887',
                        fontSize: '.77rem',
                      }}
                    >
                      Resumed from{' '}
                      <strong>
                        {formatTime(
                          savedTime
                        )}
                      </strong>
                      .
                    </Typography>
                  )}

                  <LinearProgress
                    variant="determinate"
                    value={0}
                    sx={{
                      height: 4,
                      borderRadius: 4,
                    }}
                  />

                  <Typography
                    sx={{
                      color: '#84929C',
                      fontSize: '.7rem',
                    }}
                  >
                    Video position is saved
                    automatically on this
                    device.
                  </Typography>
                </Stack>
              </Box>
            </Box>
          )}

        {!loading &&
          !error &&
          kind === 'pdf' && (
            <Box>
              <Box
                sx={{
                  height: {
                    xs: '58vh',
                    md: '68vh',
                  },
                  bgcolor: '#E9EEF2',
                }}
              >
                <iframe
                  title={resource.title}
                  src={`${blobUrl}#page=${Math.max(
                    1,
                    pdfPage
                  )}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 0,
                  }}
                />
              </Box>

              <Stack
                direction={{
                  xs: 'column',
                  sm: 'row',
                }}
                spacing={1.2}
                sx={{
                  p: 2,
                  alignItems: {
                    sm: 'center',
                  },
                }}
              >
                <TextField
                  size="small"
                  type="number"
                  label="Resume page"
                  value={pdfPage}
                  onChange={(e) =>
                    setPdfPage(
                      Math.max(
                        1,
                        Number(
                          e.target.value
                        ) || 1
                      )
                    )
                  }
                  slotProps={{
                    htmlInput: {
                      min: 1,
                    },
                  }}
                />

                <Button
                  variant="outlined"
                  onClick={savePdfPage}
                  sx={{
                    color: '#0B5A91',
                    borderColor:
                      '#B7CAD6',
                    textTransform:
                      'none',
                    fontWeight: 700,
                  }}
                >
                  Save page
                </Button>

                {savedPoint?.pageNumber && (
                  <Typography
                    sx={{
                      color: '#657887',
                      fontSize: '.75rem',
                    }}
                  >
                    Last saved page:{' '}
                    {
                      savedPoint.pageNumber
                    }
                  </Typography>
                )}
              </Stack>
            </Box>
          )}

        {!loading &&
          !error &&
          kind === 'text' && (
            <Box
              sx={{
                p: {
                  xs: 2,
                  md: 3,
                },
              }}
            >
              <Box
                sx={{
                  p: {
                    xs: 2,
                    md: 3,
                  },
                  bgcolor: '#fff',
                  border:
                    '1px solid #DCE7EE',
                  borderRadius: 2,
                }}
              >
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    alignItems:
                      'center',
                    mb: 2,
                  }}
                >
                  <ArticleOutlinedIcon
                    sx={{
                      color: '#0B5A91',
                    }}
                  />

                  <Typography
                    sx={{
                      color: '#173F60',
                      fontWeight: 800,
                    }}
                  >
                    Reading material
                  </Typography>
                </Stack>

                <Divider sx={{ mb: 2 }} />

                <Typography
                  component="pre"
                  sx={{
                    whiteSpace:
                      'pre-wrap',
                    wordBreak:
                      'break-word',
                    color: '#40596A',
                    fontFamily:
                      'inherit',
                    fontSize: '.9rem',
                    lineHeight: 1.8,
                    m: 0,
                  }}
                >
                  {textContent}
                </Typography>
              </Box>
            </Box>
          )}

        {!loading &&
          !error &&
          kind === 'image' && (
            <Box
              sx={{
                p: {
                  xs: 2,
                  md: 3,
                },
                display: 'flex',
                justifyContent:
                  'center',
                bgcolor: '#EEF3F6',
              }}
            >
              <img
                src={blobUrl}
                alt={resource.title}
                style={{
                  maxWidth: '100%',
                  maxHeight: '72vh',
                  objectFit: 'contain',
                }}
              />
            </Box>
          )}

        {!loading &&
          !error &&
          kind === 'document' && (
            <Box
              sx={{
                p: {
                  xs: 2,
                  md: 4,
                },
              }}
            >
              <Box
                sx={{
                  maxWidth: 720,
                  mx: 'auto',
                  p: {
                    xs: 2.5,
                    md: 4,
                  },
                  textAlign: 'center',
                  border:
                    '1px solid #DCE7EE',
                  borderRadius: 2.2,
                  bgcolor: '#fff',
                }}
              >
                <InsertDriveFileOutlinedIcon
                  sx={{
                    fontSize: 52,
                    color: '#0B5A91',
                  }}
                />

                <Typography
                  sx={{
                    mt: 1.3,
                    color: '#173F60',
                    fontWeight: 800,
                  }}
                >
                  Preview is not available
                  for this file format
                </Typography>

                <Typography
                  sx={{
                    mt: .6,
                    color: '#718594',
                    lineHeight: 1.6,
                    fontSize: '.84rem',
                  }}
                >
                  Download the material and
                  open it with the appropriate
                  application.
                </Typography>

                <Button
                  variant="contained"
                  startIcon={
                    <DownloadOutlinedIcon />
                  }
                  onClick={handleDownload}
                  sx={{
                    mt: 2,
                    bgcolor: '#0B5A91',
                    textTransform:
                      'none',
                    fontWeight: 800,
                  }}
                >
                  Download resource
                </Button>
              </Box>
            </Box>
          )}
      </DialogContent>

      <DialogActions
        sx={{
          px: {
            xs: 2,
            md: 3,
          },
          py: 1.4,
          borderTop:
            '1px solid #E1E9EE',
          justifyContent:
            'space-between',
        }}
      >
        <Typography
          sx={{
            color: '#84929C',
            fontSize: '.7rem',
          }}
        >
          Learning material
        </Typography>

        <Button
          startIcon={
            <DownloadOutlinedIcon />
          }
          onClick={handleDownload}
          sx={{
            color: '#0B5A91',
            textTransform: 'none',
            fontWeight: 700,
          }}
        >
          Download
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LessonViewer;
