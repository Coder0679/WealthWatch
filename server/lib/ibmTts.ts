import axios from 'axios';

export async function textToSpeechWatson(params: {
  apiKey: string;
  url: string;
  text: string;
  voice?: string;
  accept?: string;
}): Promise<{ audioBase64: string; audioFormat: string }> {
  const { apiKey, url, text, voice, accept } = params;

  // IBM Text-to-Speech typically returns raw audio.
  // We request WAV to simplify frontend playback.
  const audioFormat = 'audio/wav';
  const synthesizeUrl = new URL(url.endsWith('/v1/synthesize') ? url : `${url.replace(/\/$/, '')}/v1/synthesize`);
  if (voice) synthesizeUrl.searchParams.set('voice', voice);

  const headers = {
    'Content-Type': 'application/json',
    'Accept': accept || audioFormat,
    'Authorization': `Basic ${Buffer.from(`apikey:${apiKey}`).toString('base64')}`,
  };

  const resp = await axios.post(synthesizeUrl.toString(), { text }, {
    headers,
    responseType: 'arraybuffer',
  });

  const audioBuffer = Buffer.from(resp.data);
  return {
    audioBase64: audioBuffer.toString('base64'),
    audioFormat: 'wav',
  };
}

