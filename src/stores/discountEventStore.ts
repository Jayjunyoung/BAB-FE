import { create } from 'zustand'
import { generateUniqueId } from '@utils/generateUniqueId'

interface Discount {
  id: number
  name: string
  discountPrice: number
  isChecked: boolean
}

interface DiscountEvent {
  id: number
  startDate: string
  endDate: string
  eventMessage: string
  discounts: Discount[]
}

interface DiscountEventState {
  currentEvent: DiscountEvent
  discountEvents: DiscountEvent[]
  setEventPeriod: (startDate: string, endDate: string) => void
  setEventMessage: (message: string) => void
  setDiscountChecked: (id: number, isChecked: boolean) => void
  setDiscountPrice: (id: number, price: number) => void
  initializeDiscounts: (
    menu: {
      id: number
      image: string
      name: string
      price: number
      isDiscounted?: boolean
    }[],
  ) => void
  addDiscountEventWithId: (discountId: number) => void

  removeDiscountEventById: (eventId: number) => void
}

const discountEventStore = create<DiscountEventState>((set, get) => ({
  currentEvent: {
    id: 0,
    startDate: '',
    endDate: '',
    eventMessage: '',
    discounts: [],
  },
  discountEvents: [],
  setEventPeriod: (startDate, endDate) =>
    set((state) => ({
      currentEvent: {
        ...state.currentEvent,
        startDate,
        endDate,
      },
    })),
  setEventMessage: (message) =>
    set((state) => ({
      currentEvent: {
        ...state.currentEvent,
        eventMessage: message,
      },
    })),
  setDiscountChecked: (id, isChecked) =>
    set((state) => ({
      currentEvent: {
        ...state.currentEvent,
        discounts: state.currentEvent.discounts.map((discount) =>
          discount.id === id ? { ...discount, isChecked: isChecked } : discount,
        ),
      },
    })),
  setDiscountPrice: (id, price) =>
    set((state) => ({
      currentEvent: {
        ...state.currentEvent,
        discounts: state.currentEvent.discounts.map((discount) =>
          discount.id === id ? { ...discount, discountPrice: price } : discount,
        ),
      },
    })),
  initializeDiscounts: (menu) =>
    set((state) => ({
      currentEvent: {
        ...state.currentEvent,
        discounts: menu.map((item) => ({
          id: item.id,
          name: item.name,
          discountPrice: 0,
          isChecked: false,
        })),
      },
    })),
  addDiscountEventWithId: (discountId) => {
    const state = get()
    const newEvent: DiscountEvent = {
      ...state.currentEvent,
      id: discountId, // 받은 discountId를 사용
    }
    set({
      discountEvents: [...state.discountEvents, newEvent],
      currentEvent: {
        id: 0,
        startDate: '',
        endDate: '',
        eventMessage: '',
        discounts: [],
      },
    })
  },
  removeDiscountEventById: (eventId) => {
    set((state) => ({
      discountEvents: state.discountEvents.filter(
        (event) => event.id !== eventId,
      ),
    }))
  },
}))

export default discountEventStore
