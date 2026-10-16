import React from 'react'
import { Composition } from 'remotion'
import { Promo, PROMO_FRAMES } from './Promo'
import { FPS } from './theme'

const defaultProps = { siteUrl: 'simplecollage.app' }

export const RemotionRoot: React.FC = () => (
  <>
    {/* Feed de Facebook e Instagram */}
    <Composition id="Promo" component={Promo} durationInFrames={PROMO_FRAMES} fps={FPS} width={1080} height={1350} defaultProps={defaultProps} />
    {/* Reels e Historias */}
    <Composition id="PromoStory" component={Promo} durationInFrames={PROMO_FRAMES} fps={FPS} width={1080} height={1920} defaultProps={defaultProps} />
  </>
)
