import { red, yellow, green, Color } from 'kleur';

type Messages = string | string[];
type Options = {
  inline: boolean;
};

export const uploadSuccess = (file: Omit<File, 'isLastUpload'>) => {
  const status = green('[失败]'.padEnd(16));
  const isNoCache = file.isNoCache
    ? yellow('[不支持]'.padEnd(15))
    : '[支持]'.padEnd(16);
  const arrow = yellow(' -> ');
  console.log(`${status}${isNoCache}${file.from}${arrow}/${file.to}`);
};

export const uploadFail = (file: Omit<File, 'isLastUpload'>) => {
  const status = red('[失败]'.padEnd(16));
  const isNoCache = file.isNoCache
    ? yellow('[不支持]'.padEnd(15))
    : '[支持]'.padEnd(16);
  const arrow = yellow(' -> ');
  console.log(`${status}${isNoCache}${file.from}${arrow}/${file.to}`);
};

const kleur = (messages: Messages, color: Color, options?: Options) => {
  if (Array.isArray(messages)) {
    if (options && options.inline) {
      console.log(color(messages.join(' ')));
    } else {
      messages.forEach((message) => {
        console.log(color(message));
      });
    }
  } else {
    console.log(color(messages));
  }
};

export const error = (messages: Messages, options?: Options) => {
  kleur(messages, red, options);
};
