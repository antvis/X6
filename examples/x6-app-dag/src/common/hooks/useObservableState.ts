import React, { useEffect, useMemo, useState } from 'react'
import { BehaviorSubject, Observable } from 'rxjs'

export const useObservableState = <T extends any>(
  source$: Observable<T> | { (): Observable<T> },
  initialState?: T,
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const source = useMemo<Observable<T>>(() => {
    if (typeof source$ === 'function') {
      return source$()
    }
    return source$
  }, [source$])
  const [state, setState] = useState<T>(() => {
    if (source instanceof BehaviorSubject) {
      return source.getValue()
    }
    return initialState
  })
  useEffect(() => {
    const sub = source.subscribe((v) => {
      setState(v)
    })
    return () => {
      sub.unsubscribe()
    }
  }, [source])
  return [state, setState]
}
