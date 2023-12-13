import { Interval } from '@reactkit/utils/interval/Interval'
import { useStartOfDay } from '@reactkit/ui/hooks/useStartOfDay'
import { Panel } from '@reactkit/ui/panel/Panel'
import { IntervalInput } from '@reactkit/ui/timeline/IntervalInput'
import { useState } from 'react'
import { useTheme } from 'styled-components'
import { TitledSection } from '@reactkit/ui/layout/TitledSection'
import { convertDuration } from '@reactkit/utils/time/convertDuration'

export const CalendarEditor = () => {
  const startOfDay = useStartOfDay()

  const theme = useTheme()

  const [value, setValue] = useState<Interval>(() => ({
    start: startOfDay + convertDuration(12, 'h', 'ms'),
    end: startOfDay + convertDuration(13, 'h', 'ms'),
  }))

  return (
    <Panel width={400}>
      <TitledSection title="Add Work Session">
        <IntervalInput
          timelineStartsAt={startOfDay + convertDuration(10, 'h', 'ms')}
          timelineEndsAt={startOfDay + convertDuration(15, 'h', 'ms')}
          color={theme.colors.getLabelColor(5)}
          value={value}
          onChange={setValue}
        />
      </TitledSection>
    </Panel>
  )
}
