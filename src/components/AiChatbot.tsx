import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import ArrowUpwardOutlinedIcon from '@mui/icons-material/ArrowUpwardOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import {
  chatWithAIActivity,
  chatWithAIResourceActivity,
  chatWithAIResourceLinkActivity,
  chatWithStoredResourceActivity,
  getCurrentUser,
  getEnrollments,
  getAttemptsByTrainee,
  getMyCertificates,
  getMyFeedback,
  getMyQuestionnaireResponses,
  getTrainerCourses,
  getTrainerTrainees,
  getTrainerAnalytics,
  getTrainerQuestionnaires,
  getTrainerProfile,
  getMyStudyResource,
  apiFetchBlob,
} from '../services/api';

type Message = {
  role: 'user' | 'assistant';
  text: string;
  quickQueries?: string[];
  attachmentName?: string;
};

type AiChatbotProps = {
  resourceId?: number;
};

export default function AiChatbot({ resourceId: propResourceId }: AiChatbotProps) {
  const isAssistantPage = window.location.pathname.endsWith('/ai');
  const isTrainer = window.location.pathname.startsWith('/trainer/');
  const title = isTrainer ? 'Trainer AI Assistant' : 'Trainee AI Assistant';
  const subtitle = isTrainer
    ? 'Your coaching copilot for course design, assessments and learner support.'
    : 'Your learning copilot for courses, revision, practice and next steps.';
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [resource, setResource] = useState<File | null>(null);
  const [resourceUrl, setResourceUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activityContext, setActivityContext] = useState('');
  const [quickQueries, setQuickQueries] = useState<string[]>([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;

    const loadActivity = async () => {
      setActivityLoading(true);

      const user = await getCurrentUser();
      const userId = Number(user?.id);

      const results = isTrainer
        ? await Promise.allSettled([
            getTrainerCourses(userId),
            getTrainerTrainees(userId),
            getTrainerAnalytics(userId),
            getTrainerQuestionnaires(userId),
            getTrainerProfile(userId),
          ])
        : await Promise.allSettled([
            getEnrollments(),
            getAttemptsByTrainee(),
            getMyCertificates(),
            getMyFeedback(),
            getMyQuestionnaireResponses(),
          ]);

      const value = (item: PromiseSettledResult<unknown>) =>
        item.status === 'fulfilled' ? item.value : null;

      const context = JSON.stringify({
        role: isTrainer ? 'TRAINER' : 'TRAINEE',
        user: {
          id: user?.id,
          name: user?.name || user?.username,
          department: user?.department,
          designation: user?.designation,
        },
        recentActivity: isTrainer
          ? {
              courses: value(results[0]),
              trainees: value(results[1]),
              analytics: value(results[2]),
              questionnaires: value(results[3]),
              profile: value(results[4]),
            }
          : {
              enrollments: value(results[0]),
              assessmentAttempts: value(results[1]),
              certificates: value(results[2]),
              feedback: value(results[3]),
              questionnaireResponses: value(results[4]),
            },
      });

      const trimmed = context.slice(0, 26000);

      if (!active) return;
      setActivityContext(trimmed);

      try {
        const result = await chatWithAIActivity(
          isTrainer
            ? 'Using only my recent LMS activity, generate exactly four useful questions I should ask next. Make them specific to my actual courses, trainees, assessments, analytics, questionnaires or training work. Do not invent facts.'
            : 'Using only my recent LMS activity, generate exactly four useful questions I should ask next. Make them specific to my actual courses, assessment attempts, progress, certificates, feedback or learning. Do not invent facts.',
          trimmed
        ) as { quickQueries?: string[] };

        if (active) {
          setQuickQueries(
            Array.isArray(result.quickQueries)
              ? result.quickQueries.filter(Boolean).slice(0, 4)
              : []
          );
        }
      } catch {
        if (active) setQuickQueries([]);
      } finally {
        if (active) setActivityLoading(false);
      }
    };

    loadActivity();

    return () => {
      active = false;
    };
  }, [isTrainer]);

  useEffect(() => {
    const resourceId =
      propResourceId?.toString() ||
      new URLSearchParams(window.location.search).get('resourceId');

    if (!resourceId) return;

    const loadResource = async () => {
      try {
        const resourceData = await getMyStudyResource(Number(resourceId));

        if (resourceData?.type === 'FILE') {
          const blob = await apiFetchBlob(`/trainee/resources/${resourceId}/file`);
          const file = new File(
            [blob],
            resourceData.originalFileName || resourceData.title || 'resource',
            { type: resourceData.contentType || blob.type || 'application/octet-stream' }
          );
          setResource(file);
        } else if (resourceData?.type === 'LINK' && resourceData?.url) {
          setResourceUrl(resourceData.url);
        }
      } catch (error) {
        console.error('Failed to load selected resource:', error);
      }
    };

    loadResource();
  }, [propResourceId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text = input) => {
    const message = text.trim();
    if (!message || loading || !activityContext) return;

    const attachedFile = resource;
    const attachedUrl = resourceUrl;

    setMessages((prev) => [
      ...prev,
      {
        role: 'user',
        text: message,
        attachmentName:
          attachedFile?.name || (attachedUrl ? 'Linked resource' : undefined),
      },
    ]);
    setInput('');
    if (!propResourceId) {
      setResource(null);
      setResourceUrl(null);
    }
    setLoading(true);

    try {
      const result = propResourceId
        ? await chatWithStoredResourceActivity(message, propResourceId, activityContext) as {
            answer: string;
            quickQueries: string[];
          }
        : attachedUrl
          ? await chatWithAIResourceLinkActivity(message, attachedUrl, activityContext) as {
              answer: string;
              quickQueries: string[];
            }
          : attachedFile
            ? await chatWithAIResourceActivity(message, attachedFile, activityContext) as {
                answer: string;
                quickQueries: string[];
              }
            : await chatWithAIActivity(message, activityContext) as {
                answer: string;
                quickQueries: string[];
              };

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: result.answer,
          quickQueries: result.quickQueries?.filter(Boolean).slice(0, 4) ?? [],
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'I’m having trouble reaching Capacity AI right now. Please try again in a moment.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isAssistantPage) {
    return null;
  }

  return (
    <Box sx={{ height: 'calc(100vh - 120px)', minHeight: 620, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 2 }}>
        <Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
          <Avatar sx={{ width: 42, height: 42, bgcolor: 'primary.main' }}>
            <AutoAwesomeOutlinedIcon />
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
              {title}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 0.35 }}>
              {subtitle}
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Paper
        elevation={0}
        sx={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
          bgcolor: 'background.paper',
          boxShadow: '0 12px 35px rgba(15, 23, 42, 0.06)',
        }}
      >
        <Box sx={{ px: { xs: 2, md: 3 }, py: 1.75, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            {isTrainer ? <GroupsOutlinedIcon color="primary" /> : <SchoolOutlinedIcon color="primary" />}
            <Box>
              <Typography sx={{ fontWeight: 750, fontSize: 15 }}>
                {isTrainer ? 'Ready for your next training task?' : 'Ready to learn?'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Ask a question, attach a resource, or start with a suggestion below.
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', px: { xs: 2, md: 3 }, py: 3 }}>
          {messages.length === 0 ? (
            <Box sx={{ maxWidth: 900, mx: 'auto', mt: { xs: 3, md: 6 } }}>
              <Box
                sx={{
                  p: { xs: 2.5, md: 4 },
                  borderRadius: 3,
                  bgcolor: 'primary.50',
                  border: '1px solid',
                  borderColor: 'primary.100',
                }}
              >
                <Stack direction="row" spacing={1.25} sx={{ alignItems: "flex-start" }}>
                  <AutoAwesomeOutlinedIcon color="primary" sx={{ mt: 0.25 }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                      {isTrainer
                        ? 'Support your trainees with better decisions.'
                        : 'Learn faster with focused guidance.'}
                    </Typography>
                    <Typography color="text.secondary" sx={{ mt: 0.75, lineHeight: 1.7 }}>
                      {isTrainer
                        ? 'Use Capacity AI to turn learner data, course material and training goals into practical next actions.'
                        : 'Use Capacity AI to understand difficult concepts, practise what you learned and decide what to study next.'}
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              <Typography sx={{ mt: 3, mb: 1.25, fontWeight: 750 }}>
                Based on your recent activity
              </Typography>

              {activityLoading ? (
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <CircularProgress size={18} />
                  <Typography variant="body2" color="text.secondary">
                    Building personalised suggestions...
                  </Typography>
                </Stack>
              ) : quickQueries.length > 0 ? (
                <Stack direction="row" useFlexGap sx={{ flexWrap: 'wrap', gap: 1 }}>
                  {quickQueries.map((query) => (
                    <Chip
                      key={query}
                      label={query}
                      clickable
                      variant="outlined"
                      onClick={() => sendMessage(query)}
                      sx={{ borderRadius: 2, py: 0.35, fontWeight: 600 }}
                    />
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Ask your first question and Capacity AI will personalise the next suggestions.
                </Typography>
                )}

              {resource && (
                <Alert severity="info" sx={{ mt: 3 }}>
                  Resource ready: <strong>{resource.name}</strong>
                </Alert>
              )}
            </Box>
          ) : (
            <Box sx={{ maxWidth: 980, mx: 'auto' }}>
              {messages.map((msg, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    mb: 2.5,
                  }}
                >
                  <Box sx={{ maxWidth: { xs: '92%', md: '78%' } }}>
                    <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 0.65 }}>
                      <Avatar
                        sx={{
                          width: 28,
                          height: 28,
                          fontSize: 13,
                          bgcolor: msg.role === 'user' ? 'grey.300' : 'primary.main',
                          color: msg.role === 'user' ? 'text.primary' : 'common.white',
                        }}
                      >
                        {msg.role === 'user' ? 'U' : <AutoAwesomeOutlinedIcon sx={{ fontSize: 16 }} />}
                      </Avatar>
                      <Typography variant="caption" sx={{ fontWeight: 800 }}>
                        {msg.role === 'user' ? 'You' : 'Capacity AI'}
                      </Typography>
                    </Stack>

                    {msg.attachmentName && (
                      <Typography variant="caption" sx={{ display: 'block', mb: 0.75, color: 'text.secondary' }}>
                        Attached: {msg.attachmentName}
                      </Typography>
                    )}

                    <Box
                      sx={{
                        px: 2,
                        py: 1.5,
                        borderRadius: 2.5,
                        bgcolor: msg.role === 'user' ? 'primary.main' : 'grey.50',
                        color: msg.role === 'user' ? 'common.white' : 'text.primary',
                        border: msg.role === 'user' ? 'none' : '1px solid',
                        borderColor: msg.role === 'user' ? 'transparent' : 'divider',
                      }}
                    >
                      <Typography sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
                        {msg.text}
                      </Typography>
                    </Box>

                    {msg.role === 'assistant' && (msg.quickQueries?.length ?? 0) > 0 && (
                      <Box sx={{ mt: 1.25 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.75 }}>
                          Continue with
                        </Typography>
                        <Stack direction="row" useFlexGap sx={{ flexWrap: "wrap", gap: 0.75 }}>
                          {(msg.quickQueries ?? []).map((query) => (
                            <Chip
                              key={query}
                              size="small"
                              label={query}
                              clickable
                              variant="outlined"
                              onClick={() => sendMessage(query)}
                            />
                          ))}
                        </Stack>
                      </Box>
                    )}
                  </Box>
                </Box>
              ))}
              {loading && (
                <Stack direction="row" spacing={1} sx={{ alignItems: "center", color: 'text.secondary' }}>
                  <CircularProgress size={18} />
                  <Typography variant="body2">Capacity AI is thinking...</Typography>
                </Stack>
              )}
              <div ref={messagesEndRef} />
            </Box>
          )}
        </Box>

        <Divider />
        <Box sx={{ px: { xs: 1.5, md: 2.25 }, py: 1.5 }}>
          {resourceUrl && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              Linked resource attached
            </Typography>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.webp"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setResource(file);
            }}
          />

          <Stack direction="row" spacing={1} sx={{ alignItems: "flex-end" }}>
            <IconButton
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              title="Attach PDF or image"
              sx={{ mb: 0.35 }}
            >
              <AttachFileOutlinedIcon />
            </IconButton>

            <TextField
              fullWidth
              multiline
              maxRows={4}
              size="small"
              placeholder={
                resource
                  ? 'Ask Capacity AI about this resource...'
                  : isTrainer
                    ? 'Ask about your training work...'
                    : 'Ask about your learning...'
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
            />

            <IconButton
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              color="primary"
              sx={{ mb: 0.35 }}
            >
              <ArrowUpwardOutlinedIcon />
            </IconButton>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}
