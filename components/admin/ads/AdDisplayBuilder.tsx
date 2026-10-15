'use client';
import {
  Plus,
  Trash2,
} from 'lucide-react';
import {
  Button,
} from '@/components/ui/button';
import {
  Label,
} from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Switch,
} from '@/components/ui/switch';
import {
  Input,
} from '@/components/ui/input';
import { AdPage } from '@/constants/ads/ad-page';
import { AdDevice } from '@/constants/ads/ad-device';
import { AdPosition } from '@/constants/ads/ad-position';
import { AdTrigger } from '@/constants/ads/ad-trigger';
import { AdDisplay, } from '@/types/ad';
interface AdDisplayBuilderProps {
  value: AdDisplay[];
  onChange: (value: AdDisplay[]) => void;
}
const pages = Object.values(AdPage);
const devices = Object.values(AdDevice);
const positions = Object.values(AdPosition);
const triggers = Object.values(AdTrigger);
export function AdDisplayBuilder({
  value,
  onChange,
}: AdDisplayBuilderProps) {
  function addDisplay() {
    onChange([
      ...value,
      {
        page: AdPage.HOME,
        position: AdPosition.HERO,
        device: AdDevice.ALL,
        trigger: AdTrigger.ALWAYS,
        fixed: false,
        displayOrder: value.length + 1,
      },
    ]);
  }
  function updateDisplay(
    index: number,
    key: string,
    val: any,
  ) {
    const updated = [...value];
    updated[index] = {
      ...updated[index],
      [key]: val,
    };
    onChange(updated);
  }
  function removeDisplay(index: number) {
    onChange(
      value.filter(
        (_, i) => i !== index
      )
    );
  }
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">
            Display Rules
          </h3>
          <p className="text-[11px] text-muted-foreground">
            Choose where this advertisement appears.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addDisplay}
        >
          <Plus className="mr-2 size-4" />
          Add Placement
        </Button>
      </div>
      {
        value.map(
          (display, index) => (
            <div
              key={index}
              className="
                space-y-2
                rounded-lg
                border
                p-3
              "
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold">
                  Placement {index + 1}
                </h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeDisplay(index)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                <div>
                  <Label className="text-xs">
                    Page
                  </Label>
                  <Select
                    value={display.page}
                    onValueChange={(value) =>
                      updateDisplay(
                        index,
                        'page',
                        value
                      )
                    }
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {
                        pages.map(page => (
                          <SelectItem
                            key={page}
                            value={page}
                          >
                            {page}
                          </SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">
                    Position
                  </Label>
                  <Select
                    value={display.position}
                    onValueChange={(value) =>
                      updateDisplay(
                        index,
                        'position',
                        value
                      )
                    }
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {
                        positions.map(position => (
                          <SelectItem
                            key={position}
                            value={position}
                          >
                            {position}
                          </SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">
                    Device
                  </Label>
                  <Select
                    value={display.device}
                    onValueChange={(value) =>
                      updateDisplay(
                        index,
                        'device',
                        value
                      )
                    }
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {
                        devices.map(device => (
                          <SelectItem
                            key={device}
                            value={device}
                          >
                            {device}
                          </SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">
                    Trigger
                  </Label>
                  <Select
                    value={display.trigger}
                    onValueChange={(value) =>
                      updateDisplay(
                        index,
                        'trigger',
                        value
                      )
                    }
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {
                        triggers.map(trigger => (
                          <SelectItem
                            key={trigger}
                            value={trigger}
                          >
                            {trigger}
                          </SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                <div>
                  <Label className="text-xs">
                    Display Order
                  </Label>
                  <Input
                    type="number"
                    value={display.displayOrder}
                    onChange={(e) =>
                      updateDisplay(
                        index,
                        'displayOrder',
                        Number(e.target.value)
                      )
                    }
                    className="h-8 text-xs" />
                </div>
                <div className="flex items-center justify-between pt-4">
                  <Label className="text-xs">
                    Fixed Position
                  </Label>
                  <Switch
                    checked={display.fixed}
                    onCheckedChange={(checked) =>
                      updateDisplay(
                        index,
                        'fixed',
                        checked
                      )
                    }
                  />
                </div>
              </div>
            </div>
          )
        )
      }
    </div>
  );
}
