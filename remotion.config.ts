import {Config} from '@remotion/cli/config';
// Applies to future MP4 renders; this task only renders a PNG still.
Config.setCodec('h264');
Config.setPixelFormat('yuv420p');
Config.setChromiumOpenGlRenderer('swangle');
Config.setBrowserExecutable('/usr/bin/chromium');
