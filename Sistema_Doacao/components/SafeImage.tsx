import React, { useState } from 'react';
import { Image, ImageProps, ImageSourcePropType } from 'react-native';

type Props = Omit<ImageProps, 'source'> & {
  source?: ImageSourcePropType;
  fallback: ImageSourcePropType;
};

/**
 * Image com fallback automático caso a imagem remota falhe (android/web) ou
 * caso o source venha vazio/undefined.
 */
export function SafeImage({ source, fallback, onError, ...rest }: Props) {
  const [failed, setFailed] = useState(false);

  const finalSource = !source || failed ? fallback : source;

  return (
    <Image
      {...rest}
      source={finalSource}
      onError={(e) => {
        setFailed(true);
        onError?.(e);
      }}
    />
  );
}
