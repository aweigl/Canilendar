import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  type PropsWithChildren,
} from "react";
import {
  Keyboard,
  Platform,
  ScrollView,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ScrollViewProps,
} from "react-native";

type MeasurableNode = {
  measureInWindow?: (
    callback: (x: number, y: number, width: number, height: number) => void,
  ) => void;
} | null;

type ScrollFocusedInput = (target: MeasurableNode) => void;

const KeyboardAwareScrollContext = createContext<ScrollFocusedInput | null>(
  null,
);

export function useKeyboardAwareScroll() {
  return useContext(KeyboardAwareScrollContext);
}

type KeyboardAwareScrollViewProps = PropsWithChildren<
  ScrollViewProps & {
    keyboardOffset?: number;
  }
>;

type ScrollResponderMethods = ScrollView & {
  scrollTo?: (options: { animated?: boolean; x?: number; y?: number }) => void;
  measureInWindow?: (
    callback: (x: number, y: number, width: number, height: number) => void,
  ) => void;
};

export const KeyboardAwareScrollView = forwardRef<
  ScrollView,
  KeyboardAwareScrollViewProps
>(function KeyboardAwareScrollView(
  {
    automaticallyAdjustKeyboardInsets = Platform.OS === "ios",
    children,
    keyboardOffset = 96,
    keyboardDismissMode = Platform.OS === "ios" ? "interactive" : "on-drag",
    keyboardShouldPersistTaps = "handled",
    style,
    ...rest
  },
  forwardedRef,
) {
  const scrollRef = useRef<ScrollView>(null);
  const focusedInputRef = useRef<MeasurableNode>(null);
  const keyboardHeightRef = useRef(0);
  const scrollYRef = useRef(0);

  useImperativeHandle(forwardedRef, () => scrollRef.current as ScrollView, []);

  const ensureFocusedInputIsVisible = useCallback(() => {
    const scrollView = scrollRef.current;
    const focusedInput = focusedInputRef.current;
    const keyboardHeight = keyboardHeightRef.current;

    if (!scrollView || !focusedInput?.measureInWindow || keyboardHeight <= 0) {
      return;
    }

    (scrollView as ScrollResponderMethods).measureInWindow?.(
      (
        scrollX: number,
        scrollY: number,
        _scrollWidth: number,
        scrollHeight: number,
      ) => {
        focusedInput.measureInWindow?.(
          (
            inputX: number,
            inputY: number,
            inputWidth: number,
            inputHeight: number,
          ) => {
            const visibleTop = scrollY + keyboardOffset / 2;
            const visibleBottom =
              scrollY + scrollHeight - keyboardHeight - keyboardOffset;
            const inputTop = inputY;
            const inputBottom = inputY + inputHeight;

            let nextScrollY = scrollYRef.current;

            if (inputBottom > visibleBottom) {
              nextScrollY += inputBottom - visibleBottom;
            } else if (inputTop < visibleTop) {
              nextScrollY -= visibleTop - inputTop;
            } else {
              return;
            }

            (scrollView as ScrollResponderMethods).scrollTo?.({
              animated: true,
              x: scrollX,
              y: Math.max(0, nextScrollY),
            });
          },
        );
      },
    );
  }, [keyboardOffset]);

  const scrollFocusedInput = useCallback<ScrollFocusedInput>(
    (target) => {
      focusedInputRef.current = target;

      requestAnimationFrame(() => {
        ensureFocusedInputIsVisible();
      });
    },
    [ensureFocusedInputIsVisible],
  );

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSubscription = Keyboard.addListener(showEvent, (event) => {
      keyboardHeightRef.current = event.endCoordinates.height;
      requestAnimationFrame(() => {
        ensureFocusedInputIsVisible();
      });
    });
    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      keyboardHeightRef.current = 0;
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [ensureFocusedInputIsVisible]);

  function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    scrollYRef.current = event.nativeEvent.contentOffset.y;
    rest.onScroll?.(event);
  }

  return (
    <KeyboardAwareScrollContext.Provider value={scrollFocusedInput}>
      <ScrollView
        automaticallyAdjustKeyboardInsets={automaticallyAdjustKeyboardInsets}
        keyboardDismissMode={keyboardDismissMode}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        onScroll={handleScroll}
        ref={scrollRef}
        scrollEventThrottle={16}
        style={[styles.scrollView, style]}
        {...rest}
      >
        {children}
      </ScrollView>
    </KeyboardAwareScrollContext.Provider>
  );
});

const styles = {
  scrollView: {
    flex: 1,
  },
} as const;
