import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Button } from "../components/ui/button";

interface FilePreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  file: File | null;
  previewUrl: string | null;
  onRemove: () => void;
}

const FilePreviewDialog: React.FC<FilePreviewDialogProps> = ({ isOpen, onClose, file, previewUrl, onRemove }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">File Preview</DialogTitle>
        </DialogHeader>
        <div className="mt-4 overflow-hidden max-h-[calc(100vh-200px)]">
          <div className="flex justify-center items-center">
            {file?.type.startsWith("image/") ? (
              <img src={previewUrl as string} alt="Selected file" className="max-w-full max-h-full object-contain" />
            ) : file?.type.startsWith("video/") ? (
              <video src={previewUrl as string} controls className="max-w-full max-h-full" />
            ) : null}
          </div>
        </div>
        <Button type="button" variant="destructive" onClick={onRemove}>
          Remove File
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default FilePreviewDialog;