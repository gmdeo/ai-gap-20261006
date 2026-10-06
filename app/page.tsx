'use client';

import { useState } from 'react';

interface Memory {
  memory_id: string;
  content_text: string;
  created_timestamp_utc: string;
  confidence_score: number;
  tags_comma_separated: string;
}

export default function HomePage() {
  const [search_query_text, set_search_query_text] = useState('');
  const [stored_memories_array, set_stored_memories_array] = useState<Memory[]>([
    {
      memory_id: 'demo-1',
      content_text: 'User prefers TypeScript over JavaScript for new projects',
      created_timestamp_utc: '2026-09-15T10:30:00Z',
      confidence_score: 0.95,
      tags_comma_separated: 'preference,language'
    },
    {
      memory_id: 'demo-2',
      content_text: 'Working on AI memory dashboard project, deadline Oct 10',
      created_timestamp_utc: '2026-10-06T08:00:00Z',
      confidence_score: 1.0,
      tags_comma_separated: 'project,deadline'
    },
    {
      memory_id: 'demo-3',
      content_text: 'Last discussed: implementing semantic search with SQLite FTS5',
      created_timestamp_utc: '2026-10-06T11:15:00Z',
      confidence_score: 0.88,
      tags_comma_separated: 'technical,implementation'
    }
  ]);

  const [new_memory_content_text, set_new_memory_content_text] = useState('');
  const [new_memory_tags_text, set_new_memory_tags_text] = useState('');

  const handle_add_memory_action = () => {
    if (!new_memory_content_text.trim()) return;
    
    const new_memory_record: Memory = {
      memory_id: `demo-${Date.now()}`,
      content_text: new_memory_content_text,
      created_timestamp_utc: new Date().toISOString(),
      confidence_score: 1.0,
      tags_comma_separated: new_memory_tags_text
    };
    
    set_stored_memories_array([new_memory_record, ...stored_memories_array]);
    set_new_memory_content_text('');
    set_new_memory_tags_text('');
  };

  const handle_delete_memory_action = (memory_id_to_delete: string) => {
    set_stored_memories_array(stored_memories_array.filter(
      memory_record => memory_record.memory_id !== memory_id_to_delete
    ));
  };

  const filtered_memories_array = stored_memories_array.filter(memory_record =>
    memory_record.content_text.toLowerCase().includes(search_query_text.toLowerCase()) ||
    memory_record.tags_comma_separated.toLowerCase().includes(search_query_text.toLowerCase())
  );

  const format_confidence_badge_color = (confidence_score: number): string => {
    if (confidence_score >= 0.9) return 'bg-[var(--success)] text-white';
    if (confidence_score >= 0.7) return 'bg-[var(--warning)] text-gray-900';
    return 'bg-[var(--border-color)] text-[var(--text-secondary)]';
  };

  const format_timestamp_readable = (iso_timestamp_string: string): string => {
    const date_object = new Date(iso_timestamp_string);
    return date_object.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen p-6 lg:p-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-3">AI Memory Dashboard</h1>
          <p className="text-[var(--text-secondary)] text-lg">
            Demonstrating the #1 user-requested AI feature: persistent memory across sessions
          </p>
          <div className="mt-6 p-4 bg-[var(--surface-color)] border border-[var(--border-color)] rounded-lg">
            <p className="text-sm text-[var(--text-secondary)]">
              <strong>The Gap:</strong> AI forgets everything between sessions (GitHub issue #6007: 11 upvotes)
              <br />
              <strong>The Solution:</strong> Semantic memory layer that any AI agent can query
              <br />
              <strong>Why Now:</strong> 200× cost reduction + 1M token context windows make this viable in 2026
            </p>
          </div>
        </header>

        {/* Add Memory Section */}
        <section className="mb-8 p-6 bg-[var(--surface-color)] border border-[var(--border-color)] rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Store New Memory</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="memory-content-input" className="block text-sm font-medium mb-2">
                Memory Content
              </label>
              <textarea
                id="memory-content-input"
                className="w-full px-4 py-3 bg-[var(--background-color)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] min-h-[100px]"
                placeholder="Enter a fact, preference, or context to remember..."
                value={new_memory_content_text}
                onChange={(event_object) => set_new_memory_content_text(event_object.target.value)}
              />
            </div>
            <div>
              <label htmlFor="memory-tags-input" className="block text-sm font-medium mb-2">
                Tags (comma-separated)
              </label>
              <input
                id="memory-tags-input"
                type="text"
                className="w-full px-4 py-3 bg-[var(--background-color)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                placeholder="preference, project, technical..."
                value={new_memory_tags_text}
                onChange={(event_object) => set_new_memory_tags_text(event_object.target.value)}
              />
            </div>
            <button
              onClick={handle_add_memory_action}
              className="w-full sm:w-auto px-6 py-3 bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white font-medium rounded-lg transition-colors duration-150"
            >
              Store Memory
            </button>
          </div>
        </section>

        {/* Search Section */}
        <section className="mb-8">
          <label htmlFor="search-input" className="block text-sm font-medium mb-2">
            Search Memories
          </label>
          <input
            id="search-input"
            type="text"
            className="w-full px-4 py-3 bg-[var(--surface-color)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
            placeholder="Search by content or tags..."
            value={search_query_text}
            onChange={(event_object) => set_search_query_text(event_object.target.value)}
          />
        </section>

        {/* Memory List */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              Stored Memories ({filtered_memories_array.length})
            </h2>
          </div>
          
          <div className="space-y-4">
            {filtered_memories_array.length === 0 ? (
              <div className="p-8 text-center bg-[var(--surface-color)] border border-[var(--border-color)] rounded-lg">
                <p className="text-[var(--text-secondary)]">
                  {search_query_text ? 'No memories match your search' : 'No memories stored yet'}
                </p>
              </div>
            ) : (
              filtered_memories_array.map((memory_record) => (
                <article
                  key={memory_record.memory_id}
                  className="p-6 bg-[var(--surface-color)] border border-[var(--border-color)] rounded-lg hover:border-[var(--accent-primary)] transition-colors duration-150"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-base mb-3">{memory_record.content_text}</p>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--text-secondary)]">
                        <span>{format_timestamp_readable(memory_record.created_timestamp_utc)}</span>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${format_confidence_badge_color(memory_record.confidence_score)}`}
                        >
                          {(memory_record.confidence_score * 100).toFixed(0)}% confidence
                        </span>
                        {memory_record.tags_comma_separated && (
                          <span className="px-2 py-1 bg-[var(--background-color)] rounded text-xs">
                            {memory_record.tags_comma_separated}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handle_delete_memory_action(memory_record.memory_id)}
                      className="px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-red-600 transition-colors duration-150"
                      aria-label={`Delete memory: ${memory_record.content_text}`}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        {/* Footer Info */}
        <footer className="mt-12 pt-8 border-t border-[var(--border-color)]">
          <div className="grid sm:grid-cols-3 gap-6 text-sm">
            <div>
              <h3 className="font-semibold mb-2">Research-Backed Design</h3>
              <p className="text-[var(--text-secondary)]">
                Built on findings from 7 parallel research agents covering market landscape, user psychology, and technical feasibility
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Trust Signals</h3>
              <p className="text-[var(--text-secondary)]">
                Confidence scores, timestamps, and one-click corrections following "Show, Signal, Defer, Recover" patterns
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">What This Unlocks</h3>
              <p className="text-[var(--text-secondary)]">
                Team memory sync, cross-tool memory, memory marketplace, confidence calibration service, memory analytics
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
