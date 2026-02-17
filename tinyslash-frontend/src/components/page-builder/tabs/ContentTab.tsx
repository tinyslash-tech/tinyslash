import React, { useState } from 'react';
import { Page, PageBlock } from '../../../types/page';
import {
  GripVertical, Trash2, Eye, EyeOff, X, Plus,
  Link2, Type, Image as ImageIcon, Video, Share2, Mail, Layout, CreditCard, Minus,
  ShoppingBag, LayoutGrid
} from 'lucide-react';
import {
  DragDropContext, Droppable, Draggable,
  DropResult, DroppableProvided, DraggableProvided
} from '@hello-pangea/dnd';
import { BlockEditor } from './BlockEditors';

interface ContentTabProps {
  page: Page;
  onChange: (updates: Partial<Page>) => void;
}

export const ContentTab: React.FC<ContentTabProps> = ({ page, onChange }) => {
  const [expandedBlockId, setExpandedBlockId] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  const addBlock = (type: PageBlock['type']) => {
    const newBlock: PageBlock = {
      id: crypto.randomUUID(),
      type,
      content: getInitialContent(type),
      visible: true,
      order: page.blocks.length
    };
    onChange({ blocks: [...page.blocks, newBlock] });
    setExpandedBlockId(newBlock.id);
    setShowPicker(false);
  };

  const getInitialContent = (type: PageBlock['type']) => {
    switch (type) {
      case 'LINK': return { title: '', url: '', highlight: false };
      case 'HEADER': return { text: 'New Header', align: 'left' };
      case 'TEXT': return { text: '', align: 'left' };
      case 'SOCIAL': return { links: [{ platform: 'instagram', url: '' }] };
      case 'IMAGE': return { url: '', alt: '' };
      case 'VIDEO': return { url: '' };
      case 'FORM': return { title: 'Subscribe to my newsletter', buttonText: 'Subscribe', collectName: false };
      case 'EMAIL': return { title: 'Join my mailing list', buttonText: 'Sign Up' };
      case 'DIVIDER': return { style: 'solid', spacing: 'medium' };
      case 'PAYMENT': return { label: 'Support Me', url: '' };
      case 'AFFILIATE': return { title: '', imageUrl: '', url: '', price: '', buttonText: 'Buy Now' };
      case 'CARD': return { title: '', description: '', imageUrl: '', buttonText: 'Learn More', url: '' };
      default: return {};
    }
  };

  const updateBlock = (blockId: string, content: any) => {
    onChange({
      blocks: page.blocks.map(b => b.id === blockId ? { ...b, content } : b)
    });
  };

  const removeBlock = (blockId: string) => {
    if (confirm("Delete this block? This can't be undone.")) {
      onChange({
        blocks: page.blocks.filter(b => b.id !== blockId)
      });
    }
  };

  const toggleVisibility = (blockId: string) => {
    onChange({
      blocks: page.blocks.map(b => b.id === blockId ? { ...b, visible: !b.visible } : b)
    });
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(page.blocks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedItems = items.map((item, index) => ({ ...item, order: index }));
    onChange({ blocks: updatedItems });
  };

  // Helper to get block title for summary
  const getBlockSummary = (block: PageBlock) => {
    switch (block.type) {
      case 'LINK': return block.content.title || 'Untitled Link';
      case 'HEADER': return block.content.text || 'Header';
      case 'TEXT': return block.content.text ? (block.content.text.substring(0, 20) + '...') : 'Text Block';
      case 'IMAGE': return 'Image Block';
      case 'VIDEO': return 'Video Embed';
      case 'SOCIAL': return 'Social Icons';
      case 'FORM': return block.content.title || 'Form';
      case 'EMAIL': return block.content.title || 'Email Signup';
      case 'DIVIDER': return 'Divider';
      case 'PAYMENT': return block.content.label || 'Payment Link';
      case 'AFFILIATE': return block.content.title || 'Affiliate Product';
      case 'CARD': return block.content.title || 'Card';
      default: return block.type;
    }
  };

  const getBlockIcon = (type: PageBlock['type']) => {
    switch (type) {
      case 'LINK': return Link2;
      case 'HEADER': return Type;
      case 'TEXT': return Type;
      case 'IMAGE': return ImageIcon;
      case 'VIDEO': return Video;
      case 'SOCIAL': return Share2;
      case 'FORM': return Layout; // Use Layout for generic form
      case 'EMAIL': return Mail;
      case 'DIVIDER': return Minus;
      case 'PAYMENT': return CreditCard;
      case 'AFFILIATE': return ShoppingBag;
      case 'CARD': return LayoutGrid;
      default: return Layout;
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Blocks</h3>
      </div>

      {/* Blocks List */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="blocks">
          {(provided: DroppableProvided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-3"
            >
              {page.blocks.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl text-gray-400">
                  <p>No blocks added yet.</p>
                  <p className="text-xs mt-1">Click "+ Add Block" to get started.</p>
                </div>
              )}

              {page.blocks.map((block, index) => {
                const Icon = getBlockIcon(block.type);
                return (
                  <Draggable key={block.id} draggableId={block.id} index={index}>
                    {(provided: DraggableProvided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`bg-white border rounded-xl shadow-sm transition-all overflow-hidden ${expandedBlockId === block.id ? 'ring-2 ring-blue-500 border-transparent' : 'border-gray-200 hover:border-blue-300'
                          }`}
                      >
                        {/* Block Header / Drag Handle */}
                        <div
                          className="flex items-center justify-between p-3 bg-white"
                          onClick={() => setExpandedBlockId(expandedBlockId === block.id ? null : block.id)}
                        >
                          <div className="flex items-center gap-3 flex-1 cursor-pointer">
                            <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 p-1">
                              <GripVertical className="w-5 h-5" />
                            </div>
                            <div className={`p-1.5 rounded-lg ${expandedBlockId === block.id ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-gray-900">{getBlockSummary(block)}</span>
                              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">{block.type}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleVisibility(block.id); }}
                              className={`p-2 rounded-lg transition-colors ${block.visible ? 'text-gray-400 hover:text-gray-600' : 'text-gray-300 hover:text-gray-500 bg-gray-50'}`}
                              title={block.visible ? "Hide block" : "Show block"}
                            >
                              {block.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); removeBlock(block.id); }}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete block"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Expanded Editor */}
                        {expandedBlockId === block.id && (
                          <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                            <div className="flex justify-between items-center mb-4">
                              <h4 className="text-xs font-bold uppercase text-gray-500 tracking-wider">Edit {block.type}</h4>
                              <button onClick={() => setExpandedBlockId(null)} className="text-xs text-blue-600 font-medium hover:underline">Done</button>
                            </div>
                            <BlockEditor block={block} onChange={(content) => updateBlock(block.id, content)} />
                          </div>
                        )}
                      </div>
                    )}
                  </Draggable>
                )
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Add Block Button */}
      {!showPicker ? (
        <button
          onClick={() => setShowPicker(true)}
          className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center gap-2 text-gray-500 font-medium hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Block
        </button>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
            <h4 className="text-sm font-bold text-gray-900">Add a Block</h4>
            <button onClick={() => setShowPicker(false)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
          </div>

          <div className="space-y-6">
            <div>
              <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Essentials</h5>
              <div className="grid grid-cols-2 gap-2">
                <PickButton icon={Link2} label="Link" onClick={() => addBlock('LINK')} />
                <PickButton icon={Type} label="Header" onClick={() => addBlock('HEADER')} />
                <PickButton icon={Type} label="Text" onClick={() => addBlock('TEXT')} />
              </div>
            </div>

            <div>
              <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Media</h5>
              <div className="grid grid-cols-2 gap-2">
                <PickButton icon={ImageIcon} label="Image" onClick={() => addBlock('IMAGE')} />
                <PickButton icon={Video} label="Video" onClick={() => addBlock('VIDEO')} />
              </div>
            </div>

            <div>
              <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Engagement</h5>
              <div className="grid grid-cols-2 gap-2">
                <PickButton icon={Share2} label="Socials" onClick={() => addBlock('SOCIAL')} />
                <PickButton icon={Layout} label="Form" onClick={() => addBlock('FORM')} />
                <PickButton icon={Mail} label="Email Signup" onClick={() => addBlock('EMAIL')} />
              </div>
            </div>

            <div>
              <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Advanced</h5>
              <div className="grid grid-cols-2 gap-2">
                <PickButton icon={Minus} label="Divider" onClick={() => addBlock('DIVIDER')} />
                <PickButton icon={CreditCard} label="Payment" onClick={() => addBlock('PAYMENT')} />
                <PickButton icon={ShoppingBag} label="Affiliate" onClick={() => addBlock('AFFILIATE')} />
                <PickButton icon={LayoutGrid} label="Card" onClick={() => addBlock('CARD')} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const PickButton = ({ icon: Icon, label, onClick }: any) => (
  <button
    onClick={onClick}
    className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-blue-400 hover:ring-1 hover:ring-blue-400 hover:bg-blue-50 transition-all text-left group"
  >
    <div className="p-2 bg-gray-100 rounded-md group-hover:bg-white text-gray-600 group-hover:text-blue-600 transition-colors">
      <Icon className="w-4 h-4" />
    </div>
    <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">{label}</span>
  </button>
);
