import {red, yellow, green, white, Color} from 'kleur'

type Messages = string | string[];
type Options = {
  inline: boolean;
};

export const uploadSuccess = ({
  from,
  to,
  noCache
}) => {
  const status = green('[成功]'.padEnd(16))
  noCache = noCache
    ? yellow('[不支持]'.padEnd(15))
    : '[支持]'.padEnd(16)
  const arrow = yellow(' -> ')
  console.log(`${status}${noCache}${from}${arrow}${to}`)
}

export const uploadFail = ({
  from,
  to,
  noCache
}) => {
  const status = red('[失败]'.padEnd(16))
  noCache = noCache
    ? yellow('[不支持]'.padEnd(15))
    : '[支持]'.padEnd(16)
  const arrow = yellow(' -> ')
  console.log(`${status}${noCache}${from}${arrow}${to}`)
}

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

export const log = (messages: Messages, options?: Options) => {
  kleur(messages, white, options);
};

export const info = (messages: Messages, options?: Options) => {
  kleur(messages, white, options);
};

export const success = (messages: Messages, options?: Options) => {
  kleur(messages, green, options);
};

export const warning = (messages: Messages, options?: Options) => {
  kleur(messages, yellow, options);
};

export const error = (messages: Messages, options?: Options) => {
  kleur(messages, red, options);
};
