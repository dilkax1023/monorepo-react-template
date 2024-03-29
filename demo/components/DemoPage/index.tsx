import { SourceCodeLink } from 'components/SourceCode/SourceCodeLink'
import { RegularPage } from '@reactkit/ui/layout/RegularPage'
import { HStack } from '@reactkit/ui/layout/Stack'
import { Text } from '@reactkit/ui/text'
import { useRouter } from 'next/router'
import { YouTubeLink } from 'components/YouTubeLink'
import { ComponentWithChildrenProps } from '@reactkit/ui/props'
import { PageMetaTags } from '@reactkit/ui/metadata/PageMetaTags'

interface Props extends ComponentWithChildrenProps {
  title: string
  seoTitle?: string
  seoDescription?: string
  youtubeVideoId?: string
}

export const DemoPage = ({
  title,
  seoTitle = title,
  seoDescription,
  youtubeVideoId,
  children,
}: Props) => {
  const { pathname } = useRouter()
  return (
    <RegularPage
      title={
        <HStack alignItems="center" gap={4}>
          <Text as="h1" weight="bold" size={24} color="regular">
            {title}
          </Text>
          <SourceCodeLink
            to={`https://github.com/radzionc/reactkit/blob/main/demo/pages${pathname}.tsx`}
          />
          {youtubeVideoId && <YouTubeLink videoId={youtubeVideoId} />}
        </HStack>
      }
    >
      <PageMetaTags title={seoTitle} description={seoDescription} />
      {children}
    </RegularPage>
  )
}
