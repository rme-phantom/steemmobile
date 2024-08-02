export function ScrollingTabHandler(
  lastContentOffset: {value: number},
  parent: any,
  event: any,
) {
  // const onScroll = (event: any) => {
  //   const currentOffset = event?.contentOffset?.y;
  //   const dif = currentOffset - lastContentOffset.value;
  //   if (currentOffset !== 0)
  //     if (currentOffset == 0) {
  //       // Do something here
  //     } else if (Math.abs(dif) >= 3) {
  //       if (dif <= 0) {
  //         if (parent?.getState()?.routes[0]?.params?.value !== 1) {
  //           parent?.setParams({value: 1});
  //         }
  //         // Do something else here
  //       } else {
  //         if (dif > 10)
  //           if (parent?.getState()?.routes[0]?.params?.value !== 0) {
  //             parent?.setParams({value: 0});
  //           }
  //         // Do something else here
  //       }
  //       lastContentOffset.value = currentOffset;
  //     }
  // };

  // onScroll(event);
}
