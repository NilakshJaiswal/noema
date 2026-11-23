import { useEffect, useId, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, ChevronDown, ImagePlus, Plus, Trash2 } from 'lucide-react';
import { createItem, imageLimit, imageTypes, sectionNames } from '../../../server/content/contentSchema.js';

function ImageField({ node, value, onChange, id }) {
  const [error, setError] = useState('');
  const upload = value.startsWith('data:');
  const activeReader = useRef(null);
  const updateImage = useRef(onChange);
  useEffect(() => { updateImage.current = onChange; }, [onChange]);
  useEffect(() => () => activeReader.current?.abort(), []);

  function readImage(event) {
    const [file] = event.currentTarget.files;
    event.currentTarget.value = '';
    if (!file) return;
    if (!imageTypes.includes(file.type) || file.size > imageLimit) {
      setError('Choose a PNG, JPEG, WebP or GIF up to 256 KB.');
      return;
    }

    activeReader.current?.abort();
    const reader = new FileReader();
    activeReader.current = reader;
    reader.onload = () => { setError(''); updateImage.current(reader.result); };
    reader.onerror = () => setError('The image could not be read. Try another file.');
    reader.readAsDataURL(file);
  }

  return (
    <div className="admin-image-field admin-wide">
      <label htmlFor={id}>{node.label}</label>
      <div className="admin-image-controls">
        {value && <img src={value} alt={`${node.label} preview`} />}
        <div className="admin-image-inputs">
          <input id={id} type="text" value={upload ? '' : value} placeholder={upload ? 'Image uploaded' : 'https://example.com/image.png'}
            onChange={(event) => { activeReader.current?.abort(); setError(''); onChange(event.target.value); }} />
          <div className="admin-image-actions">
            <label className="admin-button admin-secondary admin-upload">
              <ImagePlus size={16} aria-hidden="true" /> {value ? 'Replace with a file' : 'Upload image'}
              <input className="sr-only" type="file" accept={imageTypes.join(',')} onChange={readImage} />
            </label>
            {value && <button type="button" className="admin-button admin-quiet" onClick={() => { activeReader.current?.abort(); setError(''); onChange(''); }}>Remove image</button>}
          </div>
          <p className="admin-hint">{node.label === 'Logo' ? 'An empty field uses the original logo. ' : ''}Files can be up to 256 KB.</p>
          {error && <p className="admin-field-error" role="alert">{error}</p>}
        </div>
      </div>
    </div>
  );
}

function ListEditor({ node, value, onChange }) {
  const [expanded, setExpanded] = useState(null);
  const group = node.item.type === 'group';

  function move(index, offset) {
    const destination = index + offset;
    const reordered = [...value];
    [reordered[index], reordered[destination]] = [reordered[destination], reordered[index]];
    onChange(reordered);
    setExpanded((current) => {
      if (current === index) return destination;
      if (current === destination) return index;
      return current;
    });
  }

  function remove(index) {
    onChange(value.filter((_, position) => position !== index));
    setExpanded((current) => {
      if (current === index || current === null) return null;
      return current > index ? current - 1 : current;
    });
  }

  function add() {
    onChange([...value, createItem(node.item)]);
    setExpanded(value.length);
  }

  return (
    <section className="admin-list admin-wide" aria-label={node.label}>
      <div className="admin-list-heading">
        <h3>{node.label}</h3>
        {!node.reorderOnly && <button type="button" className="admin-button admin-secondary" onClick={add} disabled={value.length >= 100}>
          <Plus size={16} aria-hidden="true" /> Add {node.item.label.toLowerCase()}
        </button>}
      </div>
      {!value.length && <p className="admin-empty">No items yet.</p>}
      <div className="admin-list-items">
        {value.map((item, index) => {
          const title = group ? item.label || item.name || item.title || item.heading : sectionNames[item];
          const itemLabel = title || `${node.item.label} ${index + 1}`;
          const update = (next) => onChange(value.map((entry, position) => position === index ? next : entry));
          const open = expanded === index;
          return (
            <div className="admin-item" key={index}>
              <div className="admin-item-row">
                {group ? (
                  <button type="button" className="admin-item-toggle" aria-expanded={open} onClick={() => setExpanded(open ? null : index)}>
                    <ChevronDown size={16} aria-hidden="true" /> <span>{itemLabel}</span>
                  </button>
                ) : (
                  <div className="admin-item-label">{itemLabel}</div>
                )}
                <div className="admin-item-actions">
                  <button className="admin-icon-button" type="button" aria-label={`Move ${itemLabel} up`} title="Move up"
                    onClick={() => move(index, -1)} disabled={index === 0}><ArrowUp size={16} aria-hidden="true" /></button>
                  <button className="admin-icon-button" type="button" aria-label={`Move ${itemLabel} down`} title="Move down"
                    onClick={() => move(index, 1)} disabled={index === value.length - 1}><ArrowDown size={16} aria-hidden="true" /></button>
                  {!node.reorderOnly && <button className="admin-icon-button admin-trash" type="button" aria-label={`Remove ${itemLabel}`} title="Remove"
                    onClick={() => remove(index)}><Trash2 size={16} aria-hidden="true" /></button>}
                </div>
              </div>
              {(group ? open : !node.reorderOnly) && (
                <div className="admin-item-fields">
                  {group ? <ContentEditor fields={node.item.fields} value={item} onChange={update} />
                    : <EditorField node={node.item} value={item} onChange={update} />}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function EditorField({ node, value, onChange }) {
  const id = useId();
  if (node.type === 'list') return <ListEditor node={node} value={value} onChange={onChange} />;
  if (node.type === 'group') {
    return (
      <details className="admin-group admin-wide" open={node.label === 'Quote' ? true : undefined}>
        <summary><ChevronDown size={16} aria-hidden="true" /> {node.label}</summary>
        <ContentEditor fields={node.fields} value={value} onChange={onChange} />
      </details>
    );
  }
  if (node.type === 'image') return <ImageField node={node} value={value} onChange={onChange} id={id} />;

  if (node.type === 'boolean') {
    return (
      <label className="admin-check" htmlFor={id}>
        <input id={id} type="checkbox" checked={value} onChange={(event) => onChange(event.target.checked)} />
        {node.label}
      </label>
    );
  }

  const change = (event) => onChange(event.target.value);
  return (
    <div className={`admin-field ${node.type === 'long' ? 'admin-wide' : ''}`}>
      <label htmlFor={id}>{node.label}</label>
      {node.type === 'long' ? (
        <textarea id={id} rows={4} value={value} onChange={change} maxLength={12000} />
      ) : node.type === 'select' ? (
        <select id={id} value={value} onChange={change}>
          {node.options.map((option) => <option key={option}>{option}</option>)}
        </select>
      ) : node.type === 'color' ? (
        <div className="admin-color">
          <input id={id} type="color" value={value} onChange={change} />
          <output htmlFor={id}>{value}</output>
        </div>
      ) : (
        <input id={id} type={node.type === 'email' ? 'email' : 'text'} value={value} onChange={change}
          maxLength={node.type === 'link' ? 2048 : 400} placeholder={node.type === 'link' ? '#section or https://…' : undefined} />
      )}
    </div>
  );
}

export default function ContentEditor({ fields, value, onChange }) {
  return (
    <div className="admin-fields">
      {Object.entries(fields).map(([key, node]) => (
        <EditorField key={key} node={node} value={value[key]} onChange={(next) => onChange({ ...value, [key]: next })} />
      ))}
    </div>
  );
}

