






"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Clapperboard,
  Download,
  LoaderCircle,
  Redo2,
  Save,
  Undo2,
} from "lucide-react";

interface StudioTopbarProps {
  projectName: string;
  onProjectNameChange: (name: string) => void;
  onSave?: () => void;
  onExport?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onBack?: () => void;
  isSaving?: boolean;
  isExporting?: boolean;
  canUndo?: boolean;
  canRedo?: boolean;
  saveStatus?: string;
  className?: string;
}

export default function StudioTopbar({
  projectName,
  onProjectNameChange,
  onSave,
  onExport,
  onUndo,
  onRedo,
  onBack,
  isSaving = false,
  isExporting = false,
  canUndo = false,
  canRedo = false,
  saveStatus = "All changes saved",
  className = "",
}: StudioTopbarProps) {
  const [editingName, setEditingName] = useState(false);

  const buttonStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    minHeight: 34,
    padding: "7px 11px",
    border: "1px solid var(--studio-border, #303030)",
    borderRadius: 8,
    background: "transparent",
    color: "var(--studio-text, #f5f5f5)",
    fontSize: 12,
    cursor: "pointer",
    whiteSpace: "nowrap",
  };

  const disabledButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    opacity: 0.4,
    cursor: "not-allowed",
  };

  const exportButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    background: "var(--studio-accent, #7c3aed)",
    borderColor: "transparent",
    color: "#fff",
    fontWeight: 600,
    paddingLeft: 14,
    paddingRight: 14,
  };

  const finishEditing = () => {
    setEditingName(false);
  };

  return (
    <header
      className={className}
      style={{
        position: "relative",
        zIndex: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 12,
        width: "100%",
        minHeight: 64,
        padding: "10px 18px",
        boxSizing: "border-box",
        background: "var(--studio-panel, #151515)",
        color: "var(--studio-text, #f5f5f5)",
        borderBottom: "1px solid var(--studio-border, #303030)",
      }}
    >
      {/* Brand and project name */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          minWidth: 0,
          flex: "1 1 240px",
        }}
      >
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            title="Back to dashboard"
            aria-label="Back to dashboard"
            style={buttonStyle}
          >
            <ArrowLeft size={16} />
          </button>
        )}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 36,
            height: 36,
            flexShrink: 0,
            borderRadius: 10,
            background: "var(--studio-accent, #7c3aed)",
            color: "#fff",
          }}
        >
          <Clapperboard size={19} />
        </div>

        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              minWidth: 0,
            }}
          >
            {editingName ? (
              <input
                autoFocus
                aria-label="Project name"
                value={projectName}
                maxLength={100}
                onChange={(event) =>
                  onProjectNameChange(event.target.value)
                }
                onBlur={finishEditing}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    finishEditing();
                  }

                  if (event.key === "Escape") {
                    finishEditing();
                  }
                }}
                style={{
                  width: "min(280px, 100%)",
                  minWidth: 100,
                  padding: "4px 6px",
                  border: "1px solid var(--studio-accent, #7c3aed)",
                  borderRadius: 5,
                  outline: "none",
                  background: "var(--studio-bg, #101010)",
                  color: "inherit",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              />
            ) : (
              <button
                type="button"
                onClick={() => setEditingName(true)}
                title="Rename project"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  maxWidth: "100%",
                  padding: 0,
                  border: 0,
                  background: "transparent",
                  color: "inherit",
                  cursor: "text",
                  fontSize: 13,
                  fontWeight: 600,
                  textAlign: "left",
                }}
              >
                <span
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {projectName.trim() || "Untitled Project"}
                </span>
                <ChevronDown size={13} style={{ flexShrink: 0 }} />
              </button>
            )}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              marginTop: 4,
              fontSize: 10,
              color: "var(--studio-muted, #999)",
            }}
          >
            {isSaving ? (
              <>
                <LoaderCircle size={11} />
                Saving...
              </>
            ) : (
              <>
                <Check size={11} />
                {saveStatus}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Editing and export actions */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          flexWrap: "wrap",
          gap: 7,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            paddingRight: 8,
            borderRight: "1px solid var(--studio-border, #303030)",
          }}
        >
          <button
            type="button"
            title="Undo"
            aria-label="Undo"
            disabled={!canUndo || !onUndo}
            onClick={onUndo}
            style={
              !canUndo || !onUndo
                ? disabledButtonStyle
                : buttonStyle
            }
          >
            <Undo2 size={16} />
          </button>

          <button
            type="button"
            title="Redo"
            aria-label="Redo"
            disabled={!canRedo || !onRedo}
            onClick={onRedo}
            style={
              !canRedo || !onRedo
                ? disabledButtonStyle
                : buttonStyle
            }
          >
            <Redo2 size={16} />
          </button>
        </div>

        {onSave && (
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            style={
              isSaving ? disabledButtonStyle : buttonStyle
            }
          >
            {isSaving ? (
              <LoaderCircle size={15} />
            ) : (
              <Save size={15} />
            )}
            Save
          </button>
        )}

        <button
          type="button"
          onClick={onExport}
          disabled={!onExport || isExporting}
          style={
            !onExport || isExporting
              ? {
                  ...exportButtonStyle,
                  opacity: 0.55,
                  cursor: "not-allowed",
                }
              : exportButtonStyle
          }
        >
          {isExporting ? (
            <LoaderCircle size={15} />
          ) : (
            <Download size={15} />
          )}
          {isExporting ? "Exporting..." : "Export"}
        </button>
      </div>
    </header>
  );
}
