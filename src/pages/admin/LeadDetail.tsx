import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { getData, updateItem } from '../../utils/localStorage';
import { toast } from 'sonner';
import { ArrowLeft, Mail, Phone, Calendar, MapPin, MessageSquare, Plus, Trash2, Edit2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { Input } from '../../components/ui/input';

export function LeadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState<any>(null);
  const [notes, setNotes] = useState<any[]>([]);
  const [newNote, setNewNote] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingNoteText, setEditingNoteText] = useState('');

  useEffect(() => {
    loadLead();
  }, [id]);

  const loadLead = async () => {
    if (!id) return;
    const foundLead = await getData(`leads/${id}`);
    if (foundLead) {
      setLead(foundLead);
      setNotes(foundLead.notes || []);
    }
  };

  const updateLeadStatus = async (newStatus: string) => {
    if (!id) return;
    await updateItem('leads', id, { status: newStatus });
    loadLead();
    toast.success('Lead status updated successfully!');
  };

  const addNote = async () => {
    if (!newNote.trim()) {
      toast.error('Please enter a note');
      return;
    }

    const note = {
      id: Date.now().toString(),
      text: newNote,
      createdAt: new Date().toISOString(),
      createdBy: 'Admin'
    };

    const updatedNotes = [...notes, note];

    if (id) {
      await updateItem('leads', id, { notes: updatedNotes });
      setNotes(updatedNotes);
      setNewNote('');
      toast.success('Note added successfully!');
    }
  };

  const updateNote = async (noteId: string) => {
    if (!editingNoteText.trim()) {
      toast.error('Note cannot be empty');
      return;
    }

    const updatedNotes = notes.map(note =>
      note.id === noteId
        ? { ...note, text: editingNoteText, updatedAt: new Date().toISOString() }
        : note
    );

    if (id) {
      await updateItem('leads', id, { notes: updatedNotes });
      setNotes(updatedNotes);
      setEditingNoteId(null);
      setEditingNoteText('');
      toast.success('Note updated successfully!');
    }
  };

  const deleteNote = async (noteId: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    const updatedNotes = notes.filter(note => note.id !== noteId);

    if (id) {
      await updateItem('leads', id, { notes: updatedNotes });
      setNotes(updatedNotes);
      toast.success('Note deleted successfully!');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Contacted':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Qualified':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Converted':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Lost':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const statuses = ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'];

  if (!lead) {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto">
          <p>Lead not found</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/admin/leads')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Leads
          </Button>
          <h1 className="text-3xl">Lead Details</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lead Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info Card */}
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-xl mb-4">Contact Information</h2>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600">Full Name</label>
                  <p className="text-lg">{lead.name}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600 flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      Email
                    </label>
                    <p className="text-blue-600">
                      <a href={`mailto:${lead.email}`}>{lead.email}</a>
                    </p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      Phone
                    </label>
                    <p className="text-blue-600">
                      <a href={`tel:${lead.phone}`}>{lead.phone}</a>
                    </p>
                  </div>
                </div>

                {lead.projectInterest && (
                  <div>
                    <label className="text-sm text-gray-600">Project Interest</label>
                    <p>{lead.projectInterest}</p>
                  </div>
                )}

                {lead.message && (
                  <div>
                    <label className="text-sm text-gray-600">Message</label>
                    <p className="bg-gray-50 p-4 rounded-lg">{lead.message}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      Source
                    </label>
                    <p>{lead.source}</p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Date Received
                    </label>
                    <p>{new Date(lead.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-xl mb-4 flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Notes & Activity
              </h2>

              {/* Add New Note */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <label className="text-sm font-medium mb-2 block">Add New Note</label>
                <Textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Enter your note here..."
                  rows={3}
                  className="mb-2"
                />
                <Button onClick={addNote} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Note
                </Button>
              </div>

              {/* Notes List */}
              <div className="space-y-3">
                {notes.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No notes yet. Add your first note above.</p>
                ) : (
                  notes.slice().reverse().map((note) => (
                    <div key={note.id} className="border rounded-lg p-4 bg-white hover:bg-gray-50">
                      {editingNoteId === note.id ? (
                        <div className="space-y-2">
                          <Textarea
                            value={editingNoteText}
                            onChange={(e) => setEditingNoteText(e.target.value)}
                            rows={3}
                          />
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => updateNote(note.id)}>
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingNoteId(null);
                                setEditingNoteText('');
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex justify-between items-start mb-2">
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">{note.createdBy}</span>
                              <span className="mx-2">•</span>
                              <span>{new Date(note.createdAt).toLocaleString()}</span>
                              {note.updatedAt && (
                                <span className="ml-2 text-xs">(edited)</span>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setEditingNoteId(note.id);
                                  setEditingNoteText(note.text);
                                }}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => deleteNote(note.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          <p className="text-gray-900 whitespace-pre-wrap">{note.text}</p>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg mb-4">Lead Status</h3>
              <select
                value={lead.status}
                onChange={(e) => updateLeadStatus(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border text-center ${getStatusColor(lead.status)}`}
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => window.location.href = `mailto:${lead.email}`}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => window.location.href = `tel:${lead.phone}`}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Lead
                </Button>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg mb-4">Timeline</h3>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
                  <div>
                    <p className="text-sm font-medium">Lead Created</p>
                    <p className="text-xs text-gray-600">
                      {new Date(lead.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                {notes.map((note) => (
                  <div key={note.id} className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-gray-300 mt-1.5"></div>
                    <div>
                      <p className="text-sm font-medium">Note Added</p>
                      <p className="text-xs text-gray-600">
                        {new Date(note.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
