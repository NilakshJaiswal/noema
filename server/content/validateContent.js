import { imageLimit, schema } from './contentSchema.js';

function validLink(value, image = false) {
  if (!value) return true;
  if (/[\s\\\u0000-\u001f\u007f]/u.test(value)) return false;
  if (value.startsWith('/') && !value.startsWith('//')) return true;
  if (!image && value.startsWith('#')) return true;
  try {
    const url = new URL(value);
    if (url.protocol === 'https:' || url.protocol === 'http:') return Boolean(url.hostname) && !url.username && !url.password;
    return !image && ['mailto:', 'tel:'].includes(url.protocol) && Boolean(url.pathname);
  } catch {
    return false;
  }
}

function validImage(value) {
  if (!value.startsWith('data:')) return value.length <= 2048 && validLink(value, true);
  const upload = /^data:image\/(png|jpeg|webp|gif);base64,([A-Za-z0-9+/]+={0,2})$/u.exec(value);
  if (!upload) return false;
  const [, type, encoded] = upload;
  if (encoded.length > Math.ceil(imageLimit / 3) * 4) return false;
  const bytes = Buffer.from(encoded, 'base64');
  if (bytes.length > imageLimit || bytes.toString('base64') !== encoded) return false;
  if (type === 'png') return bytes.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a', 'hex'));
  if (type === 'jpeg') return bytes.subarray(0, 3).equals(Buffer.from('ffd8ff', 'hex'));
  if (type === 'gif') return ['GIF87a', 'GIF89a'].includes(bytes.subarray(0, 6).toString('ascii'));
  return bytes.subarray(0, 4).toString('ascii') === 'RIFF' && bytes.subarray(8, 12).toString('ascii') === 'WEBP';
}

function parse(node, value, path) {
  const fail = (message) => { throw new Error(`${path} ${message}`); };
  if (node.type === 'group') {
    if (!value || typeof value !== 'object' || Array.isArray(value)) fail('is missing.');
    return Object.fromEntries(Object.entries(node.fields).map(([key, child]) => [
      key, parse(child, value[key], `${path} › ${child.label}`),
    ]));
  }
  if (node.type === 'list') {
    if (!Array.isArray(value) || value.length > 100) fail('must be a list with at most 100 items.');
    if (node.reorderOnly && (value.length !== node.value.length || new Set(value).size !== value.length)) {
      fail('must include each homepage section once.');
    }
    return value.map((item, index) => parse(node.item, item, `${path} › ${index + 1}`));
  }
  if (node.type === 'boolean') {
    if (typeof value !== 'boolean') fail('must be on or off.');
    return value;
  }
  if (typeof value !== 'string') fail('must be text.');
  if (node.type === 'image') {
    if (!validImage(value)) fail('must be a valid image URL or a PNG, JPEG, WebP or GIF upload under 256 KB.');
    return value;
  }
  const max = node.type === 'long' ? 12000 : node.type === 'link' ? 2048 : 400;
  if (value.length > max) fail(`must have at most ${max} characters.`);
  if (node.type === 'select' && !node.options.includes(value)) fail('has an invalid selection.');
  if (node.type === 'color' && !/^#[a-f0-9]{6}$/i.test(value)) fail('must be a six-digit hex color.');
  if (node.type === 'link' && !validLink(value)) fail('must be an HTTPS, HTTP, email or phone link, a page path, or a section anchor.');
  if (node.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(value)) fail('must be an email address.');
  return value;
}

export function validateContent(content) {
  return parse(schema, content, schema.label);
}

