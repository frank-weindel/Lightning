import { expectType } from 'tsd';
import lng from '../../index';
import BorderComponent from '../../src/components/BorderComponent.mjs';

namespace Container {
  export interface TemplateSpec extends lng.Component.TemplateSpecStrong {
    BorderComponent: typeof lng.components.BorderComponent;
    BorderComponent_SpecificType: typeof lng.components.BorderComponent<lng.components.ListComponent>
  }
}

class Container extends lng.Component<Container.TemplateSpec> implements lng.Component.ImplementTemplateSpec<Container.TemplateSpec> {
  static _template(): lng.Component.Template<Container.TemplateSpec> {
    // Template validity
    return {
      BorderComponent: {
        type: lng.components.BorderComponent,
        content: {
          text: {
            text: 'Hello World',
            // @ts-ignore-error Invalid prop
            INVALID_PROP: 123
          },
        },
        borderWidth: 5,
        borderWidthTop: 5,
        borderWidthRight: 5,
        borderWidthBottom: 5,
        borderWidthLeft: 5,
        colorBorder: 0xffffffff,
        colorBorderTop: 0xffffffff,
        colorBorderRight: 0xffffffff,
        colorBorderBottom: 0xffffffff,
        colorBorderLeft: 0xffffffff,
        borderTop: {
          rtt: true,
          colorLeft: 0xffff0000,
          text: {
            text: 'Example',
            // @ts-ignore-error Invalid prop should error
            INVALID_PROP: 123,
          }
        },
        borderRight: {
          rtt: true,
          colorLeft: 0xffff0000,
          text: {
            text: 'Example',
            // @ts-ignore-error Invalid prop should error
            INVALID_PROP: 123,
          }
        },
        borderBottom: {
          rtt: true,
          colorLeft: 0xffff0000,
          text: {
            text: 'Example',
            // @ts-ignore-error Invalid prop should error
            INVALID_PROP: 123,
          }
        },
        borderLeft: {
          rtt: true,
          colorLeft: 0xffff0000,
          text: {
            text: 'Example',
            // @ts-ignore-error Invalid prop should error
            INVALID_PROP: 123,
          }
        },
        borders: {
          rtt: true,
          colorLeft: 0xffff0000,
          text: {
            text: 'Example',
            // @ts-ignore-error Invalid prop should error
            INVALID_PROP: 123,
          }
        }
      },
      BorderComponent_SpecificType: {
        type: lng.components.BorderComponent,
        content: {
          alpha: 123,
          items: [
            { text: 'abc' }
          ],
          // @ts-expect-error Sanity check: horizontal must be a boolean
          horizontal: 123
        },
        smoothScale: 123
      }
    };
  }

  readonly BorderComponent: BorderComponent = this.getByRef('BorderComponent')!;
  readonly BorderComponent_SpecificType = this.getByRef('BorderComponent_SpecificType')!;

  _init() {
    // Direct property setting
    this.BorderComponent.content = {
      rtt: true,
      src: 'image'
    };
    expectType<number>(this.BorderComponent.borderWidth);
    this.BorderComponent.borderWidth = 123;
    this.BorderComponent.borderWidthTop = 123;
    this.BorderComponent.borderWidthRight = 123;
    this.BorderComponent.borderWidthBottom = 123;
    this.BorderComponent.borderWidthLeft = 123;
    this.BorderComponent.colorBorder = 0xffffffff;
    this.BorderComponent.colorBorderTop = 0xffffffff;
    this.BorderComponent.colorBorderRight = 0xffffffff;
    this.BorderComponent.colorBorderBottom = 0xffffffff
    this.BorderComponent.colorBorderLeft = 0xffffffff;
    this.BorderComponent.borderTop = {
      rtt: true,
      src: 'image'
    };
    this.BorderComponent.borderRight = {
      rtt: true,
      src: 'image'
    };
    this.BorderComponent.borderBottom = {
      rtt: true,
      src: 'image'
    };
    this.BorderComponent.borderLeft = {
      rtt: true,
      src: 'image'
    };
    this.BorderComponent.borders = {
      rtt: true,
      src: 'image'
    };
    // Indirect patch
    this.patch({
      BorderComponent: {
        content: {
          text: {
            text: 'Hello World',
            // @ts-ignore-error Invalid prop
            INVALID_PROP: 123
          },
        },
        borderWidth: 5,
        borderWidthTop: 5,
        borderWidthRight: 5,
        borderWidthBottom: 5,
        borderWidthLeft: 5,
        colorBorder: 0xffffffff,
        colorBorderTop: 0xffffffff,
        colorBorderRight: 0xffffffff,
        colorBorderBottom: 0xffffffff,
        colorBorderLeft: 0xffffffff,
        borderTop: {
          rtt: true,
          colorLeft: 0xffff0000,
          text: {
            text: 'Example',
            // @ts-ignore-error Invalid prop should error
            INVALID_PROP: 123,
          }
        },
        borderRight: {
          rtt: true,
          colorLeft: 0xffff0000,
          text: {
            text: 'Example',
            // @ts-ignore-error Invalid prop should error
            INVALID_PROP: 123,
          }
        },
        borderBottom: {
          rtt: true,
          colorLeft: 0xffff0000,
          text: {
            text: 'Example',
            // @ts-ignore-error Invalid prop should error
            INVALID_PROP: 123,
          }
        },
        borderLeft: {
          rtt: true,
          colorLeft: 0xffff0000,
          text: {
            text: 'Example',
            // @ts-ignore-error Invalid prop should error
            INVALID_PROP: 123,
          }
        },
        borders: {
          rtt: true,
          colorLeft: 0xffff0000,
          text: {
            text: 'Example',
            // @ts-ignore-error Invalid prop should error
            INVALID_PROP: 123,
          }
        }
      }
    });

    // Direct patch
    this.BorderComponent.patch({
      content: {
        text: {
          text: 'Hello World',
          // @ts-ignore-error Invalid prop
          INVALID_PROP: 123
        },
      },
      borderWidth: 5,
      borderWidthTop: 5,
      borderWidthRight: 5,
      borderWidthBottom: 5,
      borderWidthLeft: 5,
      colorBorder: 0xffffffff,
      colorBorderTop: 0xffffffff,
      colorBorderRight: 0xffffffff,
      colorBorderBottom: 0xffffffff,
      colorBorderLeft: 0xffffffff,
      borderTop: {
        rtt: true,
        colorLeft: 0xffff0000,
        text: {
          text: 'Example',
          // @ts-ignore-error Invalid prop should error
          INVALID_PROP: 123,
        }
      },
      borderRight: {
        rtt: true,
        colorLeft: 0xffff0000,
        text: {
          text: 'Example',
          // @ts-ignore-error Invalid prop should error
          INVALID_PROP: 123,
        }
      },
      borderBottom: {
        rtt: true,
        colorLeft: 0xffff0000,
        text: {
          text: 'Example',
          // @ts-ignore-error Invalid prop should error
          INVALID_PROP: 123,
        }
      },
      borderLeft: {
        rtt: true,
        colorLeft: 0xffff0000,
        text: {
          text: 'Example',
          // @ts-ignore-error Invalid prop should error
          INVALID_PROP: 123,
        }
      },
      borders: {
        rtt: true,
        colorLeft: 0xffff0000,
        text: {
          text: 'Example',
          // @ts-ignore-error Invalid prop should error
          INVALID_PROP: 123,
        }
      }
    });

    // Specific type tests
    this.BorderComponent_SpecificType.content = {
      alpha: 123,
      items: [
        { text: 'abc' }
      ],
      // @ts-expect-error Sanity check: horizontal must be a boolean
      horizontal: 123
    };

    expectType<lng.components.ListComponent>(this.BorderComponent_SpecificType.content);

    this.patch({
      BorderComponent_SpecificType: {
        content: {
          alpha: 123,
          items: [
            { text: 'abc' }
          ],
          // @ts-expect-error Sanity check: horizontal must be a boolean
          horizontal: 123
        },
        smoothScale: 123
      }
    });

    this.BorderComponent_SpecificType.patch({
      content: {
        alpha: 123,
        items: [
          { text: 'abc' }
        ],
        // @ts-expect-error Sanity check: horizontal must be a boolean
        horizontal: 123
      },
      smoothScale: 123
    });
  }
}