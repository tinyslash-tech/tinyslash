import React, { useState } from 'react';
import { Page, PageBlock } from '../../../types/page';
import {
  Plus, GripVertical, Trash2, Link2, Type, Image as ImageIcon,
  Share2, Mail, Video, Layout
} from 'lucide-react';
import {
  DragDropContext, Droppable, Draggable,
  DropResult, DroppableProvided, DraggableProvided
} from '@hello-pangea/dnd';

interface ContentTabProps {
  page: Page;
  onChange: (updates: Partial<Page>) => void;
}

export const ContentTab: React.FC<ContentTabProps> = ({ page, onChange }) => {

  const addBlock = (type: PageBlock['type']) => {
    const newBlock: PageBlock = {
      id: crypto.randomUUID(),
      type,
      content: getInitialContent(type),
      visible: true,
      order: page.blocks.length
    };
    onChange({ blocks: [...page.blocks, newBlock] });
  };

  const getInitialContent = (type: PageBlock['type']) => {
    switch (type) {
      case 'LINK': return { title: 'New Link', url: '' };
      case 'HEADER': return { text: 'Header Text' };
      case 'TEXT': return { text: 'Description text...' };
      case 'SOCIAL': return { platform: 'instagram', url: '' };
      case 'IMAGE': return { url: '', alt: '' };
      case 'FORM': return { title: 'Join our Newsletter', fields: ['email'] }; // Basic mock
      default: return {};
    }
  };

  const updateBlock = (blockId: string, content: any) => {
    onChange({
      blocks: page.blocks.map(b => b.id === blockId ? { ...b, content } : b)
    });
  };

  const removeBlock = (blockId: string) => {
    onChange({
      blocks: page.blocks.filter(b => b.id !== blockId)
    });
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(page.blocks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order data directly
    const updatedItems = items.map((item, index) => ({ ...item, order: index }));
    onChange({ blocks: updatedItems });
  };

  return (
    <div className="space-y-6">
      {/* Block Type Selector */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        <BlockButton icon={Link2} label="Link" onClick={() => addBlock('LINK')} color="text-blue-600" />
        <BlockButton icon={Type} label="Header" onClick={() => addBlock('HEADER')} color="text-purple-600" />
        <BlockButton icon={Type} label="Text" onClick={() => addBlock('TEXT')} color="text-gray-600" />
        <BlockButton icon={ImageIcon} label="Image" onClick={() => addBlock('IMAGE')} color="text-green-600" />
        <BlockButton icon={Share2} label="Socials" onClick={() => addBlock('SOCIAL')} color="text-pink-600" />
        <BlockButton icon={Mail} label="Form" onClick={() => addBlock('FORM')} color="text-orange-600" />
      </div>

      <div className="border-t border-gray-100 my-4"></div>

      {/* Blocks List */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="blocks">
          {(provided: DroppableProvided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-3 min-h-[200px]"
            >
              {page.blocks.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl text-gray-400">
                  <p>No blocks added yet.</p>
                  <p className="text-xs">Click a button above to add content.</p>
                </div>
              )}

              {page.blocks.map((block, index) => (
                <Draggable key={block.id} draggableId={block.id} index={index}>
                  {(provided: DraggableProvided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm group hover:border-blue-200 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div {...provided.dragHandleProps} className="currso-grab active:cursor-grabbing text-gray-300 hover:text-gray-500">
                            <GripVertical className="w-5 h-5" />
                          </div>
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{block.type}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => removeBlock(block.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Inline Editor for each block type */}
                      <BlockEditor block={block} onChange={(content) => updateBlock(block.id, content)} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

const BlockButton = ({ icon: Icon, label, onClick, color }: any) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95"
  >
    <Icon className={`w-6 h-6 ${color} mb-1.5`} />
    <span className="text-xs font-medium text-gray-700">{label}</span>
  </button>
);

const BlockEditor = ({ block, onChange }: { block: PageBlock, onChange: (c: any) => void }) => {
  switch (block.type) {
    case 'LINK':
      return (
        <div className="space-y-2">
          <input
            type="text"
            value={block.content.title || ''}
            onChange={(e) => onChange({ ...block.content, title: e.target.value })}
            placeholder="Link Title"
            className="w-full text-sm border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="text"
            value={block.content.url || ''}
            onChange={(e) => onChange({ ...block.content, url: e.target.value })}
            placeholder="https://"
            className="w-full text-sm border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      );
    case 'HEADER':
    case 'TEXT':
      return (
        <input
          type="text"
          value={block.content.text || ''}
          onChange={(e) => onChange({ ...block.content, text: e.target.value })}
          placeholder="Enter text..."
          className="w-full text-sm border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 font-medium"
        />
      );
    case 'SOCIAL':
      return (
        <div className="space-y-2">
          <select
            value={block.content.platform || 'instagram'}
            onChange={(e) => onChange({ ...block.content, platform: e.target.value })}
            className="w-full text-sm border-gray-300 rounded mb-2"
          >
            <option value="instagram">Instagram</option>
            <option value="twitter">X (Twitter)</option>
            <option value="linkedin">LinkedIn</option>
            <option value="youtube">YouTube</option>
            <option value="github">GitHub</option>
          </select>
          <input
            type="text"
            value={block.content.url || ''}
            onChange={(e) => onChange({ ...block.content, url: e.target.value })}
            placeholder="Profile URL"
            className="w-full text-sm border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      );
    default:
      return <div className="text-xs text-gray-400 italic">Settings for this block are specific.</div>;
  }
};
