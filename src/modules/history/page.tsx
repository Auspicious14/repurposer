// pages/history/index.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useHistory } from "./context";
import {
  LinkedinIcon,
  TwitterIcon,
  EmailIcon,
  FacebookIcon,
  WhatsappIcon,
  InstapaperIcon,
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  ThreadsIcon,
  ThreadsShareButton,
  TwitterShareButton,
} from "react-share";
import { toast } from "sonner";
import { Tooltip } from "react-tooltip";

// Types for the content history
interface RepurposedContent {
  _id: string;
  originalContent: string;
  repurposedContent: string;
  templateId?: string;
  templateName?: string;
  platform: string;
  tone: string;
  sampleData: Record<string, string>;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  metadata?: {
    wordCount: number;
    characterCount: number;
    placeholdersUsed: string[];
  };
}

interface HistoryFilters {
  platform: string;
  tone: string;
  dateRange: string;
  search: string;
}

export default function HistoryPage() {
  const router = useRouter();
  const { fetchHistory, history, loading } = useHistory();
  // const [contents, setContents] = useState<RepurposedContent[]>([]);
  const [filteredContents, setFilteredContents] = useState<RepurposedContent[]>(
    []
  );
  const [selectedContent, setSelectedContent] =
    useState<RepurposedContent | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<HistoryFilters>({
    platform: "",
    tone: "",
    dateRange: "",
    search: "",
  });

  const itemsPerPage = 12;

  useEffect(() => {
    fetchHistory();
  }, []);

  console.log({ history });

  useEffect(() => {
    let filtered = history;

    // Apply filters
    if (filters.platform) {
      filtered = filtered.filter(
        (content) => content.platform === filters.platform
      );
    }

    if (filters.tone) {
      filtered = filtered.filter((content) => content.tone === filters.tone);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (content) =>
          content.repurposedContent.toLowerCase().includes(searchLower) ||
          content.templateName?.toLowerCase().includes(searchLower) ||
          content.platform.toLowerCase().includes(searchLower) ||
          content.tone.toLowerCase().includes(searchLower)
      );
    }

    if (filters.dateRange) {
      const now = new Date();
      const filterDate = new Date();

      switch (filters.dateRange) {
        case "today":
          filterDate.setHours(0, 0, 0, 0);
          break;
        case "week":
          filterDate.setDate(now.getDate() - 7);
          break;
        case "month":
          filterDate.setMonth(now.getMonth() - 1);
          break;
      }

      filtered = filtered.filter(
        (content) => new Date(content.createdAt) >= filterDate
      );
    }

    setFilteredContents(filtered);
    setCurrentPage(1);
  }, [filters, history]);

  // Pagination
  const totalPages = Math.ceil(filteredContents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedContents = filteredContents.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleFilterChange = (key: keyof HistoryFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ platform: "", tone: "", dateRange: "", search: "" });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPlatformIcon = (platform: string) => {
    const icons = {
      twitter: TwitterIcon,
      linkedin: LinkedinIcon,
      instagram: InstapaperIcon,
      email: EmailIcon,
      blog: "📝",
      facebook: FacebookIcon,
      tiktok: "🎵",
    };
    return icons[platform as keyof typeof icons] || "📄";
  };

  const getToneColor = (tone: string) => {
    const colors = {
      casual: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      professional:
        "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
      friendly:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      formal:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      humorous:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      persuasive: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      informative:
        "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
    };
    return colors[tone as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const handleCopyContent = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Copied");
  };

  const getSocials = (name: string, url: string) => {
    switch (name) {
      case "Twitter":
        return {
          name: "Twitter",
          icon: (
            <div data-tooltip-id="twitter-tooltip">
              <div>
                <TwitterShareButton title={name} url={`${url}`}>
                  <TwitterIcon size={28} round={true} />
                </TwitterShareButton>
              </div>
              <Tooltip id="twitter-tooltip" content="Post to X" />
            </div>
          ),
        };
      case "LinkedIn":
        return {
          name: "LinkedIn",
          icon: (
            <div data-tooltip-id="linkedin-tooltip">
              <div>
                <LinkedinShareButton url={`${url}`}>
                  <LinkedinIcon size={28} round={true} />
                </LinkedinShareButton>
              </div>
              <Tooltip id="linkedin-tooltip" content="Post to LinkedIn" />
            </div>
          ),
        };
      case "Thread":
        return {
          name: "Thread",
          icon: (
            <div data-tooltip-id="twitter-tooltip">
              <div>
                <ThreadsShareButton url={`${url}`}>
                  <ThreadsIcon size={28} round={true} />
                </ThreadsShareButton>
              </div>
              <Tooltip id="thread-tooltip" content="Post to Threads" />
            </div>
          ),
        };
      case "Facebook":
        return {
          name: "Facebook",
          icon: (
            <div data-tooltip-id="facebook-tooltip">
              <div>
                <FacebookShareButton url={`${url}`}>
                  <FacebookIcon size={28} round={true} />
                </FacebookShareButton>
              </div>
              <Tooltip id="facebook-tooltip" content="Post to Facebook" />
            </div>
          ),
        };
      case "Email":
        return {
          name: "Email",
          icon: (
            <div data-tooltip-id="mail-tooltip">
              <div>
                <EmailShareButton url={`mailto:${url}`}>
                  <EmailIcon size={28} round={true} />
                </EmailShareButton>
              </div>
              <Tooltip id="mail-tooltip" content="Post to E-mail" />
            </div>
          ),
        };
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="flex items-center gap-3 text-[var(--text-secondary)]">
              <svg
                className="w-8 h-8 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span className="text-lg">Loading your content history...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
              Content History
            </h1>
            <p className="text-[var(--text-secondary)]">
              View and manage your repurposed content
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/templates"
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 text-sm font-medium"
            >
              View Templates
            </Link>
            <Link
              href="/templates/create"
              className="px-6 py-2 bg-[var(--primary)] text-white rounded-lg hover:opacity-90 transition-all duration-200 text-sm font-medium shadow-lg"
            >
              + Create New
            </Link>
          </div>
        </div>

        <div className="card p-6 rounded-xl shadow-lg mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
            <div className="flex-1 min-w-0">
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Search Content
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                placeholder="Search by content, template, platform..."
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
              />
            </div>

            <div className="w-full lg:w-48">
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Platform
              </label>
              <select
                value={filters.platform}
                onChange={(e) => handleFilterChange("platform", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
              >
                <option value="">All Platforms</option>
                <option value="twitter">Twitter</option>
                <option value="linkedin">LinkedIn</option>
                <option value="instagram">Instagram</option>
                <option value="email">Email</option>
                <option value="blog">Blog</option>
                <option value="facebook">Facebook</option>
                <option value="tiktok">TikTok</option>
              </select>
            </div>

            <div className="w-full lg:w-48">
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Tone
              </label>
              <select
                value={filters.tone}
                onChange={(e) => handleFilterChange("tone", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
              >
                <option value="">All Tones</option>
                <option value="casual">Casual</option>
                <option value="professional">Professional</option>
                <option value="friendly">Friendly</option>
                <option value="formal">Formal</option>
                <option value="humorous">Humorous</option>
                <option value="persuasive">Persuasive</option>
                <option value="informative">Informative</option>
              </select>
            </div>

            <div className="w-full lg:w-48">
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Date Range
              </label>
              <select
                value={filters.dateRange}
                onChange={(e) =>
                  handleFilterChange("dateRange", e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
              >
                <option value="">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>

            <button
              onClick={clearFilters}
              className="px-4 py-3 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200 whitespace-nowrap"
            >
              Clear Filters
            </button>
          </div>

          {(filters.platform ||
            filters.tone ||
            filters.dateRange ||
            filters.search) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {filters.search && (
                <span className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full">
                  {`Search: "{filters.search}"`}
                  <button
                    onClick={() => handleFilterChange("search", "")}
                    className="ml-2 hover:text-blue-600"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.platform && (
                <span className="inline-flex items-center px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm rounded-full">
                  Platform: {filters.platform}
                  <button
                    onClick={() => handleFilterChange("platform", "")}
                    className="ml-2 hover:text-green-600"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.tone && (
                <span className="inline-flex items-center px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-sm rounded-full">
                  Tone: {filters.tone}
                  <button
                    onClick={() => handleFilterChange("tone", "")}
                    className="ml-2 hover:text-purple-600"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mb-6">
          <p className="text-[var(--text-secondary)]">
            Showing {paginatedContents.length} of {filteredContents.length}{" "}
            results
          </p>
          <div className="text-sm text-[var(--text-secondary)]">
            Page {currentPage} of {totalPages}
          </div>
        </div>

        {filteredContents.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                No content found
              </h3>
              <p className="text-[var(--text-secondary)] mb-6">
                {Object.values(filters).some((f) => f)
                  ? "Try adjusting your filters or search terms"
                  : "Start creating templates to see your content history here"}
              </p>
              {!Object.values(filters).some((f) => f) && (
                <Link
                  href="/templates/create"
                  className="px-6 py-3 bg-[var(--primary)] text-white rounded-lg hover:opacity-90 transition-all duration-200 font-medium"
                >
                  Create Your First Template
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedContents.map((content) => (
              <div
                key={content._id}
                className="card p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-700"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {getPlatformIcon(content.platform) as string}
                    </span>
                    <div>
                      <div className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wide">
                        {content.platform}
                      </div>
                      {content.templateName && (
                        <div className="text-sm text-[var(--text-primary)] font-medium">
                          {content.templateName}
                        </div>
                      )}
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full font-medium ${getToneColor(
                      content.tone
                    )}`}
                  >
                    {content.tone}
                  </span>
                </div>

                <div className="mb-4">
                  <p className="text-[var(--text-primary)] text-sm line-clamp-4 mb-2">
                    {content.repurposedContent}
                  </p>
                  {content.metadata && (
                    <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)]">
                      <span>{content.metadata.wordCount} words</span>
                      <span>{content.metadata.characterCount} chars</span>
                      {content.metadata.placeholdersUsed.length > 0 && (
                        <span>
                          {content.metadata.placeholdersUsed.length}{" "}
                          placeholders
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {content.metadata?.placeholdersUsed &&
                  content.metadata.placeholdersUsed.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {content.metadata.placeholdersUsed
                          .slice(0, 3)
                          .map((placeholder) => (
                            <span
                              key={placeholder}
                              className="inline-flex items-center px-2 py-1 bg-[var(--primary)] text-white text-xs rounded-full font-medium"
                            >
                              {`{{${placeholder}}}`}
                            </span>
                          ))}
                        {content.metadata.placeholdersUsed.length > 3 && (
                          <span className="text-xs text-[var(--text-secondary)]">
                            +{content.metadata.placeholdersUsed.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
                  <div className="text-xs text-[var(--text-secondary)]">
                    {formatDate(content.createdAt)}
                  </div>
                  <div className="flex items-center gap-2">
                    {getSocials(content.platform, window.location.href)?.icon}
                    <button
                      onClick={() =>
                        handleCopyContent(content.repurposedContent)
                      }
                      className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
                      data-tooltip-id="copy content"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                    <Tooltip
                      id="copy content"
                      content="Copy content"
                      className="text-sm"
                    />

                    <button
                      onClick={() => {
                        setSelectedContent(content);
                        setShowPreview(true);
                      }}
                      className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
                      data-tooltip-id="view details"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </button>
                    <Tooltip
                      id="view details"
                      content="View Details"
                      className="text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center mt-8 gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 text-sm rounded-lg transition-colors duration-200 ${
                  page === currentPage
                    ? "bg-[var(--primary)] text-white"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}

        {/* Preview Modal */}
        {showPreview && selectedContent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm transition-opacity duration-300"
              onClick={() => setShowPreview(false)}
            />

            <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {
                      getPlatformIcon(
                        selectedContent.platform
                      ) as React.ReactNode
                    }
                  </span>
                  <div>
                    <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                      {selectedContent.templateName || "Content Details"}
                    </h2>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {selectedContent.platform} • {selectedContent.tone} •{" "}
                      {formatDate(selectedContent.createdAt)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Repurposed Content */}
                <div>
                  <h3 className="text-lg font-medium text-[var(--text-primary)] mb-3">
                    Generated Content
                  </h3>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                    <pre className="whitespace-pre-wrap text-[var(--text-primary)] font-sans">
                      {selectedContent.repurposedContent}
                    </pre>
                  </div>
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={() =>
                        handleCopyContent(selectedContent.repurposedContent)
                      }
                      className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:opacity-90 transition-all duration-200 text-sm font-medium"
                    >
                      Copy Content
                    </button>
                  </div>
                </div>

                {/* Original Template */}
                <div>
                  <h3 className="text-lg font-medium text-[var(--text-primary)] mb-3">
                    Original Template
                  </h3>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                    <pre className="whitespace-pre-wrap text-[var(--text-secondary)] font-sans text-sm">
                      {selectedContent.originalContent}
                    </pre>
                  </div>
                </div>

                {/* Sample Data Used */}
                {Object.keys(selectedContent.sampleData).length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-[var(--text-primary)] mb-3">
                      Data Used
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(selectedContent.sampleData).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border"
                          >
                            <div className="text-sm font-medium text-[var(--text-primary)] mb-1">
                              {`{{${key}}}`}
                            </div>
                            <div className="text-sm text-[var(--text-secondary)]">
                              {value}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* Metadata */}
                {selectedContent.metadata && (
                  <div>
                    <h3 className="text-lg font-medium text-[var(--text-primary)] mb-3">
                      Content Statistics
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-2xl font-bold text-[var(--primary)]">
                          {selectedContent.metadata.wordCount}
                        </div>
                        <div className="text-sm text-[var(--text-secondary)]">
                          Words
                        </div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-2xl font-bold text-[var(--primary)]">
                          {selectedContent.metadata.characterCount}
                        </div>
                        <div className="text-sm text-[var(--text-secondary)]">
                          Characters
                        </div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-2xl font-bold text-[var(--primary)]">
                          {selectedContent.metadata.placeholdersUsed.length}
                        </div>
                        <div className="text-sm text-[var(--text-secondary)]">
                          Placeholders
                        </div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-2xl font-bold text-[var(--primary)]">
                          {Math.ceil(selectedContent.metadata.wordCount / 200)}
                        </div>
                        <div className="text-sm text-[var(--text-secondary)]">
                          Min Read
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() =>
                      handleCopyContent(selectedContent.repurposedContent)
                    }
                    className="flex-1 px-4 py-3 bg-[var(--primary)] text-white rounded-lg hover:opacity-90 transition-all duration-200 font-medium text-center"
                  >
                    Copy to Clipboard
                  </button>

                  {selectedContent.templateId && (
                    <Link
                      href={`/templates/${selectedContent.templateId}`}
                      className="flex-1 px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium text-center"
                    >
                      View Template
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      // Create new content based on this template
                      if (selectedContent.templateId) {
                        router.push(
                          `/templates/create?template=${selectedContent.templateId}`
                        );
                      } else {
                        router.push("/templates/create");
                      }
                    }}
                    className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium text-center"
                  >
                    Create Similar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
