import { TOptionDialog } from '@/types/types';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  Stack,
  TextareaAutosize,
  Typography,
} from '@mui/material';
import { Dispatch, SetStateAction } from 'react';

export default function OptionDialog({
  optionDialog,
  handleOptionClose,
  setOptionDialog,
  handleOptionSubmit,
}: {
  optionDialog: TOptionDialog;
  setOptionDialog: Dispatch<SetStateAction<TOptionDialog>>;
  handleOptionClose: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleOptionSubmit: () => void;
}) {
  return (
    <Dialog open={optionDialog.isOpen} onClose={handleOptionClose}>
      <DialogTitle>Chat Options</DialogTitle>
      <DialogContent>
        <Typography>System Prompt:</Typography>
        <TextareaAutosize
          onChange={(e) => {
            console.log('e target value', e.target.value);
            setOptionDialog((pre) => {
              return {
                ...pre,
                systemMessage: e.target.value,
              };
            });
          }}
          value={optionDialog.systemMessage}
          style={{
            // width: '100%',
            minWidth: 400,
            height: 150,
            // resize: 'none',
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '8px',
            fontSize: '14px',
            lineHeight: '1.5',
            boxSizing: 'border-box',
          }}
        ></TextareaAutosize>
        <Stack
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <InputLabel>Provide content:</InputLabel>
          <Checkbox
            checked={optionDialog.provideContent}
            onChange={(e) => {
              console.log('checked:', e.target.checked);
              setOptionDialog((pre) => {
                return {
                  ...pre,
                  provideContent: e.target.checked,
                };
              });
            }}
          ></Checkbox>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleOptionClose}>Cancel</Button>
        <Button onClick={handleOptionSubmit}>Confirm</Button>
      </DialogActions>
    </Dialog>
  );
}
