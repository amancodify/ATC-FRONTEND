/**
 * AI Chat Component
 * Full-height conversational UI with inline loading, new chat, suggested prompts,
 * and @mention dealer autocomplete.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import Markdown from 'markdown-to-jsx';
import API_URL from '../../../config';
import './AIChat.scss';

const SUGGESTIONS = [
    { icon: '👨‍💻', text: 'Siwan Godown(SV001) ka latest 10 Refill transaction dikaho.' },
    { icon: '💰', text: 'Dibyanshu Trading Co ka kitna Outstanding hai ?' },
    { icon: '💰', text: 'Show 5 Latest transactions of dealer 820894.' },
    { icon: '👥', text: 'How many total dealers are there in ATC?' },
    { icon: '📍', text: 'Show the area-wise dealer count.' },
    { icon: '📦', text: 'What is the Fresh stock of Godown SV001?' },
    { icon: '🏗️', text: 'List all godowns.' },
    { icon: '🏭', text: 'List all products.' },
];

const WORD_INTERVAL = 18; // ms between words during typewriter
const CHUNK_SIZE = 3;     // words revealed per tick

/**
 * Build reveal-units from markdown content.
 * Normal text → individual words (keeping spaces / newlines).
 * Table blocks (consecutive lines starting with |) → one single unit
 * so the entire table appears at once without partial rendering.
 */
function buildRevealUnits(content) {
    // Split off the <details> reasoning block — it should appear instantly (no animation)
    const detailsIdx = content.indexOf('<details');
    const mainContent = detailsIdx >= 0 ? content.substring(0, detailsIdx) : content;
    const detailsBlock = detailsIdx >= 0 ? content.substring(detailsIdx) : '';

    const lines = mainContent.split('\n');
    const units = [];
    let tableBlock = [];

    for (let i = 0; i < lines.length; i++) {
        const isTable = /^\s*\|/.test(lines[i]);

        if (isTable) {
            tableBlock.push(lines[i]);
        } else {
            if (tableBlock.length > 0) {
                units.push(tableBlock.join('\n'));
                tableBlock = [];
                units.push('\n');
            }
            const words = lines[i].split(/( )/);
            units.push(...words);
            if (i < lines.length - 1) units.push('\n');
        }
    }
    if (tableBlock.length > 0) {
        units.push(tableBlock.join('\n'));
    }

    // Append the details block as a single instant unit at the end
    if (detailsBlock) {
        units.push(detailsBlock);
    }
    return units;
}

/**
 * TypewriterMarkdown — reveals markdown content word-by-word.
 * Tables are revealed instantly as a single block.
 * Once finished, calls onComplete so the parent can mark it done.
 */
const TypewriterMarkdown = ({ content, onComplete, scrollFn }) => {
    const [wordCount, setWordCount] = useState(0);
    const words = useRef(buildRevealUnits(content));
    const total = words.current.length;

    useEffect(() => {
        if (wordCount >= total) {
            onComplete?.();
            return;
        }
        const t = setTimeout(() => {
            setWordCount(prev => Math.min(prev + CHUNK_SIZE, total));
            scrollFn?.();
        }, WORD_INTERVAL);
        return () => clearTimeout(t);
    }, [wordCount, total, onComplete, scrollFn]);

    const visible = words.current.slice(0, wordCount).join('');

    return (
        <Markdown options={{
            overrides: {
                details: { component: 'details' },
                summary: { component: 'summary' },
                table: {
                    component: ({ children, ...props }) => (
                        <div className="ai-chat__table-wrap">
                            <table {...props}>{children}</table>
                        </div>
                    ),
                },
            },
            forceWrapper: true,
        }}>{visible}</Markdown>
    );
};

const AIChat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [chatId, setChatId] = useState(null);
    const [copied, setCopied] = useState(null);
    const [typingIdx, setTypingIdx] = useState(null); // index of message currently typing

    // @mention state
    const [mentionQuery, setMentionQuery] = useState(null);   // null = dropdown hidden
    const [mentionResults, setMentionResults] = useState([]);
    const [mentionLoading, setMentionLoading] = useState(false);
    const [mentionIndex, setMentionIndex] = useState(0);       // highlighted row
    const [selectedDealer, setSelectedDealer] = useState([]); // array of chosen dealer objects

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const abortRef = useRef(null);
    const mentionAbortRef = useRef(null);

    const isEmptyChat = messages.length === 0;

    /* ─── auto-scroll ────────────────────────────────────────────────── */
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);
    useEffect(() => { inputRef.current?.focus(); }, []);

    /* ─── @mention: debounced dealer search ──────────────────────────── */
    useEffect(() => {
        if (mentionQuery === null || mentionQuery.length < 2) {
            setMentionResults([]);
            return;
        }
        const timer = setTimeout(async () => {
            try {
                if (mentionAbortRef.current) mentionAbortRef.current.abort();
                const controller = new AbortController();
                mentionAbortRef.current = controller;
                setMentionLoading(true);
                const { data } = await axios.get(
                    `${API_URL}/ai/dealers/search`,
                    { params: { q: mentionQuery }, withCredentials: true, signal: controller.signal },
                );
                if (data.success) {
                    setMentionResults(data.dealers || []);
                    setMentionIndex(0);
                }
            } catch (err) {
                if (!axios.isCancel(err)) console.error('Mention search error:', err);
            } finally {
                setMentionLoading(false);
            }
        }, 250);
        return () => clearTimeout(timer);
    }, [mentionQuery]);

    /* ─── detect @ in input ──────────────────────────────────────────── */
    const handleInputChange = (e) => {
        const val = e.target.value;
        setInput(val);
        setError(null);

        // Find the last @ that precedes the cursor
        const cursorPos = e.target.selectionStart;
        const textBefore = val.substring(0, cursorPos);
        const atIdx = textBefore.lastIndexOf('@');

        if (atIdx !== -1) {
            // Ensure no space between @ and the start, and it's either at position 0 or preceded by a space
            const charBefore = atIdx > 0 ? textBefore[atIdx - 1] : ' ';
            const textAfter = textBefore.substring(atIdx + 1);
            // If there's text after @ without any newline — it's a mention query
            if ((charBefore === ' ' || charBefore === '\n' || atIdx === 0) && !/\n/.test(textAfter)) {
                setMentionQuery(textAfter);
                return;
            }
        }
        setMentionQuery(null);
    };

    /* ─── select a dealer from dropdown ──────────────────────────────── */
    const selectDealer = (dealer) => {
        // Replace "@<query>" with "@FirmName" in the input
        const cursorPos = inputRef.current?.selectionStart || input.length;
        const textBefore = input.substring(0, cursorPos);
        const atIdx = textBefore.lastIndexOf('@');
        const textAfterCursor = input.substring(cursorPos);

        const displayName = dealer.firm_name || dealer.name;
        const newInput =
            input.substring(0, atIdx) +
            '@' + displayName + ' ' +
            textAfterCursor;

        setInput(newInput);
        // Append to array (avoid duplicates by party_code)
        setSelectedDealer(prev => {
            if (prev.some(d => d.party_code === dealer.party_code)) return prev;
            return [...prev, dealer];
        });
        setMentionQuery(null);
        setMentionResults([]);

        // Restore focus and move cursor after the inserted mention
        setTimeout(() => {
            inputRef.current?.focus();
            const newCursor = atIdx + displayName.length + 2; // +2 for @ and trailing space
            inputRef.current?.setSelectionRange(newCursor, newCursor);
        }, 0);
    };

    /* ─── send message ───────────────────────────────────────────────── */
    const sendMessage = async (text = null) => {
        const msg = (text || input).trim();
        if (!msg) return;

        setError(null);
        setLoading(true);
        setInput('');
        setMentionQuery(null);
        setMentionResults([]);

        const userMsg = { role: 'user', content: msg, timestamp: new Date().toISOString() };
        setMessages(prev => [...prev, userMsg]);

        const currentChatId = chatId || `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        if (!chatId) setChatId(currentChatId);

        // Build the full message history including this new user message for context
        const fullHistory = [...messages, userMsg];

        try {
            // Cancel any previous in-flight request
            if (abortRef.current) abortRef.current.abort();
            const controller = new AbortController();
            abortRef.current = controller;

            const payload = { message: msg, messages: fullHistory, chat_id: currentChatId };
            // Attach selected dealer context(s) if available
            if (selectedDealer.length === 1) {
                payload.dealer_context = selectedDealer[0];
            } else if (selectedDealer.length > 1) {
                payload.dealer_contexts = selectedDealer;
            }

            const { data } = await axios.post(
                `${API_URL}/ai/chat`,
                payload,
                { timeout: 30000, withCredentials: true, signal: controller.signal },
            );

            if (data.success) {
                const newIdx = messages.length + 1; // +1 because userMsg is at messages.length
                setTypingIdx(newIdx);
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: data.response,
                    timestamp: data.timestamp,
                    query_used: data.query_used,
                    docs_found: data.docs_found,
                }]);
                setChatId(data.chat_id);
            } else {
                setError(data.error || 'Failed to get response');
                setMessages(prev => prev.slice(0, -1));
            }
        } catch (err) {
            // Ignore aborted requests (happens when New Chat is clicked mid-request)
            if (axios.isCancel(err) || err.name === 'AbortError' || err.code === 'ERR_CANCELED') return;
            console.error('Chat error:', err);
            setError(
                err.response?.data?.error ||
                (err.message === 'Network Error'
                    ? 'Network error. Check your connection.'
                    : 'Failed to send message. Try again.'),
            );
            setMessages(prev => prev.slice(0, -1));
        } finally {
            setLoading(false);
            setSelectedDealer([]);
            inputRef.current?.focus();
        }
    };

    /* ─── new chat ───────────────────────────────────────────────────── */
    const startNewChat = () => {
        // Cancel any in-flight request so old responses don't leak in
        if (abortRef.current) {
            abortRef.current.abort();
            abortRef.current = null;
        }
        setMessages([]);
        setChatId(null);
        setInput('');
        setError(null);
        setLoading(false);
        setCopied(null);
        setTypingIdx(null);
        setSelectedDealer([]);
        setMentionQuery(null);
        setMentionResults([]);
        inputRef.current?.focus();
    };

    /* ─── copy ───────────────────────────────────────────────────────── */
    const copyToClipboard = (content, idx) => {
        navigator.clipboard.writeText(content);
        setCopied(idx);
        setTimeout(() => setCopied(null), 2000);
    };

    /* ─── keyboard ───────────────────────────────────────────────────── */
    const handleKeyDown = (e) => {
        // Mention dropdown navigation
        if (mentionQuery !== null && mentionResults.length > 0) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setMentionIndex(prev => (prev + 1) % mentionResults.length);
                return;
            }
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                setMentionIndex(prev => (prev - 1 + mentionResults.length) % mentionResults.length);
                return;
            }
            if (e.key === 'Enter') {
                e.preventDefault();
                selectDealer(mentionResults[mentionIndex]);
                return;
            }
            if (e.key === 'Escape') {
                e.preventDefault();
                setMentionQuery(null);
                setMentionResults([]);
                return;
            }
        }

        if (e.key === 'Enter' && !e.shiftKey && !loading) {
            e.preventDefault();
            sendMessage();
        }
    };

    /* ─── render ─────────────────────────────────────────────────────── */
    return (
        <div className="ai-chat">
            {/* ── header ─────────────────────────────────────────────── */}
            <header className="ai-chat__header">
                <div className="ai-chat__header-left">
                    <span className="ai-chat__logo">✦</span>
                    <h1>ATC AI Assistant</h1>
                </div>
                <button className="ai-chat__new-btn" onClick={startNewChat} title="New conversation">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M8 1v14M1 8h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    New Chat
                </button>
            </header>

            {/* ── messages ───────────────────────────────────────────── */}
            <main className="ai-chat__body">
                {isEmptyChat ? (
                    <div className="ai-chat__welcome">
                        <div className="ai-chat__welcome-icon">✦</div>
                        <h2>What can I help you with?</h2>
                        <p>Ask about dealers, godowns, products, transactions & more.</p>
                        <p className="ai-chat__mention-hint">💡 Type @ to search and tag a dealer by name</p>
                        <div className="ai-chat__suggestions">
                            {SUGGESTIONS.map((s, i) => (
                                <button
                                    key={i}
                                    className="ai-chat__suggestion"
                                    onClick={() => sendMessage(s.text)}
                                    disabled={loading}
                                >
                                    <span className="ai-chat__suggestion-icon">{s.icon}</span>
                                    <span>{s.text}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="ai-chat__messages">
                        {messages.map((m, idx) => (
                            <div key={idx} className={`ai-chat__msg ai-chat__msg--${m.role}`}>
                                {m.role === 'assistant' && (
                                    <div className="ai-chat__avatar ai-chat__avatar--ai">✦</div>
                                )}
                                <div className="ai-chat__msg-col">
                                    <div className={`ai-chat__bubble ai-chat__bubble--${m.role}${idx === typingIdx ? ' ai-chat__bubble--typing' : ''}`}>
                                        {m.role === 'user' ? (
                                            <p>{m.content}</p>
                                        ) : idx === typingIdx ? (
                                            <>
                                                <TypewriterMarkdown
                                                    content={m.content}
                                                    scrollFn={scrollToBottom}
                                                    onComplete={() => setTypingIdx(null)}
                                                />
                                                <div className="ai-chat__msg-actions">
                                                    <button
                                                        className="ai-chat__copy-btn"
                                                        onClick={() => copyToClipboard(m.content, idx)}
                                                    >
                                                        {copied === idx ? '✓ Copied' : '📋 Copy'}
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <Markdown options={{
                                                    overrides: {
                                                        details: { component: 'details' },
                                                        summary: { component: 'summary' },
                                                        table: {
                                                            component: ({ children, ...props }) => (
                                                                <div className="ai-chat__table-wrap">
                                                                    <table {...props}>{children}</table>
                                                                </div>
                                                            ),
                                                        },
                                                    },
                                                    forceWrapper: true,
                                                }}>{m.content}</Markdown>
                                                <div className="ai-chat__msg-actions">
                                                    <button
                                                        className="ai-chat__copy-btn"
                                                        onClick={() => copyToClipboard(m.content, idx)}
                                                    >
                                                        {copied === idx ? '✓ Copied' : '📋 Copy'}
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <span className="ai-chat__time">
                                        {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        ))}

                        {/* inline loading indicator */}
                        {loading && (
                            <div className="ai-chat__msg ai-chat__msg--assistant">
                                <div className="ai-chat__avatar ai-chat__avatar--ai">✦</div>
                                <div className="ai-chat__bubble ai-chat__bubble--loading">
                                    <div className="ai-chat__dots">
                                        <span /><span /><span />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>
                )}
            </main>

            {/* ── error toast ────────────────────────────────────────── */}
            {error && (
                <div className="ai-chat__error">
                    <span>⚠️ {error}</span>
                    <button onClick={() => setError(null)}>✕</button>
                </div>
            )}

            {/* ── input bar ──────────────────────────────────────────── */}
            <footer className="ai-chat__footer">
                <div className="ai-chat__input-row">
                    {/* @mention dropdown — positioned above the input */}
                    {mentionQuery !== null && (mentionResults.length > 0 || mentionLoading) && (
                        <div className="ai-chat__mention-dropdown">
                            {mentionLoading && mentionResults.length === 0 ? (
                                <div className="ai-chat__mention-loading">Searching dealers…</div>
                            ) : (
                                mentionResults.map((d, i) => (
                                    <div
                                        key={d.party_code}
                                        className={`ai-chat__mention-item ${i === mentionIndex ? 'ai-chat__mention-item--active' : ''}`}
                                        onMouseDown={(e) => { e.preventDefault(); selectDealer(d); }}
                                        onMouseEnter={() => setMentionIndex(i)}
                                    >
                                        <span className="ai-chat__mention-firm">{d.firm_name}</span>
                                        <span className="ai-chat__mention-meta">
                                            {d.party_code} · {d.name} · {d.dealer_area}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    <textarea
                        ref={inputRef}
                        className="ai-chat__input"
                        value={input}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask me anything… Type @ to tag a dealer"
                        disabled={loading}
                        rows={1}
                    />
                    <button
                        className="ai-chat__send-btn"
                        onClick={() => sendMessage()}
                        disabled={loading || !input.trim()}
                        title="Send (Enter)"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor"/>
                        </svg>
                    </button>
                </div>
                <span className="ai-chat__hint">Enter to send · Shift+Enter for new line · @ to tag dealer</span>
            </footer>
        </div>
    );
};

export default AIChat;
