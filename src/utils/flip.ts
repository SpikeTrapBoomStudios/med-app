/**
 * Animate a content-swap between two sibling elements.
 * Call after the swap has already occurred in the DOM.
 */
export function playSwap(elementA: HTMLElement, elementB: HTMLElement, duration = 280) {
  const boundsA = elementA.getBoundingClientRect()
  const boundsB = elementB.getBoundingClientRect()
  const deltaY = boundsB.top - boundsA.top

  elementA.style.transition = 'none'
  elementA.style.transform = `translateY(${deltaY}px)`
  elementB.style.transition = 'none'
  elementB.style.transform = `translateY(${-deltaY}px)`

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const transitionStyle = `transform ${duration}ms cubic-bezier(0.2, 0, 0, 1)`
      elementA.style.transition = transitionStyle
      elementA.style.transform = ''
      elementB.style.transition = transitionStyle
      elementB.style.transform = ''
      elementA.addEventListener('transitionend', () => {
        elementA.style.transition = ''
        elementB.style.transition = ''
      }, { once: true })
    })
  })
}

/** Call before deletion. Returns null if the key isn't found. */
export function snapshotForDelete(
  container: Element,
  selector: string,
  deletedKey: string,
  getKey: (element: Element) => string,
  getCoordinate: (bounds: DOMRect) => number,
): { deletedSlot: number; coords: number[] } | null {
  const elements = Array.from(container.querySelectorAll(selector))
  const deletedSlot = elements.findIndex(element => getKey(element) === deletedKey)
  if (deletedSlot === -1) return null
  return { deletedSlot, coords: elements.map(element => getCoordinate(element.getBoundingClientRect())) }
}

/** Call after deletion. Slides remaining elements from their previous positions. */
export function playDeleteShift(
  container: Element,
  selector: string,
  snapshot: { deletedSlot: number; coords: number[] },
  getCoordinate: (bounds: DOMRect) => number,
  axis: 'X' | 'Y',
  duration = 280,
) {
  const { deletedSlot, coords } = snapshot
  const movers: { element: HTMLElement; delta: number }[] = []

  Array.from(container.querySelectorAll(selector)).forEach((element, newSlot) => {
    const oldSlot = newSlot >= deletedSlot ? newSlot + 1 : newSlot
    const delta = coords[oldSlot] - getCoordinate(element.getBoundingClientRect())
    if (Math.abs(delta) < 0.5) return
    movers.push({ element: element as HTMLElement, delta })
  })

  if (movers.length === 0) return

  for (const { element, delta } of movers) {
    element.style.transition = 'none'
    element.style.transform = `translate${axis}(${delta}px)`
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      for (const { element } of movers) {
        element.style.transition = `transform ${duration}ms cubic-bezier(0.2, 0, 0, 1)`
        element.style.transform = ''
      }
      movers[0].element.addEventListener('transitionend', () => {
        for (const { element } of movers) element.style.transition = ''
      }, { once: true })
    })
  })
}

/** Fade + slide a newly-added element into its natural position. */
export function animateIn(element: HTMLElement, duration = 260) {
  element.style.transition = 'none'
  element.style.opacity = '0'
  element.style.transform = 'translateY(10px)'

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      element.style.transition = `transform ${duration}ms cubic-bezier(0.2, 0, 0, 1), opacity ${duration}ms ease`
      element.style.transform = ''
      element.style.opacity = ''
      element.addEventListener('transitionend', () => {
        element.style.transition = ''
        element.style.transform = ''
        element.style.opacity = ''
      }, { once: true })
    })
  })
}

export function snapshotPositions(
  container: Element,
  selector: string,
  getKey: (element: Element) => string,
): Map<string, DOMRect> {
  const positionMap = new Map<string, DOMRect>()
  container.querySelectorAll(selector).forEach(element => {
    positionMap.set(getKey(element), element.getBoundingClientRect())
  })
  return positionMap
}

export function playFLIP(
  container: Element,
  selector: string,
  getKey: (element: Element) => string,
  before: Map<string, DOMRect>,
  duration = 280,
) {
  const movers: { element: HTMLElement; deltaX: number; deltaY: number }[] = []

  container.querySelectorAll(selector).forEach(element => {
    const boundsBeforeMove = before.get(getKey(element))
    if (!boundsBeforeMove) return
    const boundsAfterMove = element.getBoundingClientRect()
    const deltaX = boundsBeforeMove.left - boundsAfterMove.left
    const deltaY = boundsBeforeMove.top - boundsAfterMove.top
    if (Math.abs(deltaX) < 0.5 && Math.abs(deltaY) < 0.5) return
    movers.push({ element: element as HTMLElement, deltaX, deltaY })
  })

  if (movers.length === 0) return

  for (const { element, deltaX, deltaY } of movers) {
    element.style.transition = 'none'
    element.style.transform = `translate(${deltaX}px, ${deltaY}px)`
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      for (const { element } of movers) {
        element.style.transition = `transform ${duration}ms cubic-bezier(0.2, 0, 0, 1)`
        element.style.transform = ''
      }
      movers[0].element.addEventListener('transitionend', () => {
        for (const { element } of movers) {
          element.style.transition = ''
        }
      }, { once: true })
    })
  })
}
