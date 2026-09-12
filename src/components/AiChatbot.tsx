import { useEffect, useRef, useState } from 'react';
import { Box, Paper, TextField, IconButton, Typography, Chip, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { chatWithAI, chatWithAIResourceLink, getMyStudyResource, apiFetchBlob } from '../services/api';

type Message = {
  role: 'user' | 'assistant';
  text: string;
  quickQueries?: string[];
  attachmentName?: string;
};

export default function AiChatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [resource, setResource] = useState<File | null>(null);
    const [resourceUrl, setResourceUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const resourceId = new URLSearchParams(window.location.search).get('resourceId');
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
  }, []);


  const sendMessage = async (text = input) => {
    const message = text.trim();
    if (!message || loading) return;

    const attachedFile = resource;
      const attachedUrl = resourceUrl;

    setMessages(prev => [
      ...prev,
      {
        role: 'user',
        text: message,
        attachmentName: attachedFile?.name || (attachedUrl ? '🔗 Linked resource' : undefined),
      },
    ]);
    setInput('');
    setResource(null);
    setLoading(true);

    try {
      const result = attachedUrl
          ? await chatWithAIResourceLink(message, attachedUrl) as {
              answer: string;
              quickQueries: string[];
            }
          : await chatWithAI(message, attachedFile) as {
        answer: string;
        quickQueries: string[];
      };

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: result.answer,
          quickQueries: result.quickQueries || [],
        },
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', text: 'Sorry, AI is currently unavailable.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
        <SmartToyIcon />
        <Typography sx={{ fontWeight: 700 }}>Capacity AI</Typography>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
        {messages.length === 0 && (
          <Typography color="text.secondary">
            Ask me anything about your learning.
          </Typography>
        )}

        {messages.map((msg, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 13 }}>
              {msg.role === 'user' ? 'You' : 'Capacity AI'}
            </Typography>

            {msg.attachmentName && (
              <Typography
                variant="caption"
                sx={{
                  mt: 0.5,
                  display: 'inline-flex',
                  alignItems: 'center',
                  fontWeight: 600,
                }}
              >
                📎 {msg.attachmentName}
              </Typography>
            )}

            <Typography sx={{ mt: 0.5, whiteSpace: 'pre-wrap' }}>
              {msg.text}
            </Typography>

            {msg.role === 'assistant' && (msg.quickQueries?.length ?? 0) > 0 && (
              <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {(msg.quickQueries ?? []).map((query, i) => (
                  <Chip
                    key={i}
                    label={query}
                    clickable
                    onClick={() => sendMessage(query)}
                    variant="outlined"
                  />
                ))}
              </Box>
            )}
          </Box>
        ))}

        {loading && <CircularProgress size={22} />}
      </Box>

      <Box sx={{ p: 1.5, borderTop: '1px solid', borderColor: 'divider' }}>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,.webp"
          hidden
          onChange={async e => {
            const file = e.target.files?.[0];
            if (!file) return;
            setResource(file);
          }}
        />

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <IconButton
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            title="Attach PDF or image"
          >
            📎
          </IconButton>

          <TextField
            fullWidth
            size="small"
            placeholder={resource ? 'Ask AI about this resource...' : 'Ask anything...'}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') sendMessage();
            }}
          />

          <IconButton onClick={() => sendMessage()} disabled={loading || !input.trim()}>
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
}
