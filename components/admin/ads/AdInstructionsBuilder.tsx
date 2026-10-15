'use client';
import {
  useState,
} from 'react';
import {
  Input,
} from '@/components/ui/input';
import {
  Button,
} from '@/components/ui/button';
import {
  Label,
} from '@/components/ui/label';
interface Props {
  value: string[];
  onChange: (value: string[]) => void;
}
export function AdInstructionsBuilder({
  value,
  onChange,
}: Props) {
  const [input, setInput] =
    useState('');
  function addInstruction() {
    const text =
      input.trim();
    if (!text)
      return;
    onChange([
      ...value,
      text,
    ]);
    setInput('');
  }
  function removeInstruction(
    index: number,
  ) {
    onChange(
      value.filter(
        (_, i) => i !== index,
      ),
    );
  }
  return (
    <div className="space-y-2">
      <Label className="text-xs">
        Instructions
      </Label>
      <div className="
        flex
        gap-1.5
      ">
        <Input
          value={input}
          onChange={(e) =>
            setInput(e.target.value)
          }
          placeholder="
            Add instruction
          "
          className="h-8 text-xs" />
        <Button
          type="button"
          onClick={addInstruction} className="h-8 px-3 text-xs"
        >
          Add
        </Button>
      </div>
      <div className="space-y-1.5">
        {
          value.map(
            (item, index) => (
              <div
                key={index}
                className="
                  flex
                  items-center
                  justify-between
                  rounded-md
                  border
                  p-2
                "
              >
                <span className="min-w-0 break-words text-xs">{index + 1}. {item}</span>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() =>
                    removeInstruction(index)
                  }
                >
                  Remove
                </Button>
              </div>
            )
          )
        }
      </div>
    </div>
  );
}
