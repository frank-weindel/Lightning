import Animation from "../animation/Animation.mjs";
import AnimationSettings from "../animation/AnimationSettings.mjs";
import Transition from "../animation/Transition.mjs";
import TransitionSettings from "../animation/TransitionSettings.mjs";
import Component from "../application/Component.mjs";
import EventEmitter from "../EventEmitter.mjs";
import TextTexture from "../textures/TextTexture.mjs";
import ElementCore from "./core/ElementCore.mjs";
import ElementTexturizer from "./core/ElementTexturizer.mjs";
import ElementChildList from "./ElementChildList.mjs";
import Shader from "./Shader.mjs";
import Stage from "./Stage.mjs";
import Texture from "./Texture.mjs";
import TextureSource from "./TextureSource.mjs";

/**
 * Set of all capital letters
 *
 * @hidden Internal use only
 */
type Alphabet = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z';

/**
 * Any string that begins with a capital letter
 *
 * @hidden Internal use only
 */
export type ValidRef = `${Alphabet}${string}`;

/**
 * Filters out any non-ref keys from an inline Element template and returns the filtered
 * type with Strong Element template spec.
 *
 * @hidden Internal use only
 */
export type InlineElement<ElementTemplate> = {
  [P in keyof ElementTemplate as P extends ValidRef ? P : never]:
    ElementTemplate[P]
} & Element<Element.TemplateSpecStrong>['__$type_TemplateSpec'];

declare namespace Element {
  export type Constructor<C extends Element = Element> = new (...a: any[]) => C;

  /**
   * ???
   */
  export type OnAfterCalcsCallback<T extends Element = Element> = (el: T) => void;

  /**
   * ???
   */
  export type OnAfterUpdateCallback<T extends Element = Element> = (el: T) => void;

  /**
   * ???
   */
  export type OnUpdateCallback<T extends Element = Element> = (el: T, core: ElementCore) => void;

  /**
   * ???
   */
  export interface Flex {
    alignContent?:
      | 'flex-start'
      | 'flex-end'
      | 'center'
      | 'space-between'
      | 'space-around'
      | 'space-evenly'
      | 'stretch';
    alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch';
    direction?: 'column' | 'row';
    justifyContent?:
      | 'flex-start'
      | 'flex-end'
      | 'center'
      | 'space-between'
      | 'space-around'
      | 'space-evenly';
    padding?: number;
    paddingBottom?: number;
    paddingLeft?: number;
    paddingRight?: number;
    paddingTop?: number;
    wrap?: boolean;
  }

  /***
   * ???
   */
  export interface FlexItem {
    margin?: number;
    marginBottom?: number;
    marginLeft?: number;
    marginRight?: number;
    marginTop?: number;
  }

  /**
   * An object keyed by transitionable Element properties (numeric properties)
   * and valued by {@link lng.types.TransitionSettings.Literal}
   */
  export type TransitionsTemplate<TemplateSpecType = TemplateSpecStrong> = {
    [P in keyof TemplateSpecType]?:
      number extends TemplateSpecType[P]
        ?
          TransitionSettings.Literal
        :
          never
  };

  /**
   * An object keyed by transitionable Element properties (numeric properties).
   *
   * @remarks
   * For each property:
   * - If the value is a `number`:
   *   - Property value to smoothly transition to (using the default transition)
   * - If the value is a 2-value array:
   *   - array[0] = Property value to smoothly transition to
   *   - array[1] = Settings describing the transition
   */
  export type SmoothTemplate<LT = TemplateSpecStrong> = {
    [P in keyof LT]?:
      number extends LT[P]
        ?
          number | [ number, TransitionSettings.Literal ]
        :
          never
  };

  /**
   * Valid numeric property keys from SmoothTemplate
   */
  export type SmoothTemplateKeys<LT = TemplateSpecStrong> = keyof {
    [P in keyof SmoothTemplate<LT> as SmoothTemplate<LT>[P] extends undefined ? never : P]: SmoothTemplate<LT>[P]
  };

  export interface TemplateSpecStrong {
    /**
     * ???
     */
    ref: string | undefined;

    /**
     * Element's Texture
     *
     * @remarks
     * ???
     */
    texture: Texture | Texture.Literal | null;

    /**
     * Creates a tag context
     *
     * Tagged Elements in this branch will not be reachable
     * from ancestors of this Element.
     *
     * @defaultValue false
     */
    tagRoot: boolean;

    /**
     * Sets a Bounds Margin for this Element.
     *
     * Format:
     * ```text
     * [left margin, top margin, right margin, bottom margin]
     * ```
     *
     * - If `null` (default):
     *   - Inherit from Bounds Margins from parent
     *
     * Note: If no bounds margins are set in the render tree, the default on all
     *       sides is `100`.
     *
     * @remarks
     *
     * The Bounds Margin influences whether an Element will be rendered as if it were
     * on screen. If the Bounds Margin is `0` on all sides, then this Element will only be
     * rendered if exactly any part of it's rectangle is potentially visible on screen. Adding
     * to the Bounds Margin allows an Element to be rendered as it gets closer to becoming
     * visible on screen.
     *
     * @defaultValue null
     */
    boundsMargin: [number, number, number, number] | null;

    /**
     * X position of this Element
     *
     * @remarks
     * If set with a method the value is made dynamic based
     * on the parent Element's width.
     *
     * @defaultValue 0
     */
    x: number | ((parentWidth: number) => number);

    /**
     * Y position of this Element
     *
     * @remarks
     * If set with a method the value is made dynamic based
     * on the parent Element's height.
     *
     * @defaultValue 0
     */
    y: number | ((parentHeight: number) => number);

    /**
     * Width of this Element
     *
     * @remarks
     * If set with a method the value is made dynamic based
     * on the parent Element's width.
     *
     * @defaultValue 0
     */
    w: number | ((parentWidth: number) => number);

    /**
     * Height of this Element
     *
     * @remarks
     * If set with a method the value is made dynamic based
     * on the parent Element's height.
     *
     * @defaultValue 0
     */
    h: number | ((parentHeight: number) => number);

    /**
     * ???
     */
    collision: boolean | 2;

    /**
     * Rectangle texture mode
     *
     * When set, this Element adopts a RectangleTexture as its Texture
     * and displays a rectangle colored by the various `color*` properties.
     *
     * @remarks
     * Cannot be set at the same time as {@link src} or {@link text}.
     *
     * @defaultValue false
     *
     * @see
     * - {@link color}
     * - {@link colorTop}
     * - {@link colorBottom}
     * - {@link colorLeft}
     * - {@link colorRight}
     * - {@link colorUl}
     * - {@link colorUr}
     * - {@link colorBl}
     * - {@link colorBr}
     */
    rect: boolean;
    /**
     * Scale Horizontal Tranform
     *
     * Stretches or shrinks this Element along the horizontal axis.
     *
     * @defaultValue 1.0
     */
    scaleX: number;

    /**
     * Scale Vertical Tranform
     *
     * Stretches or shrinks this Element along the vertical axis.
     *
     * @defaultValue 1.0
     */
    scaleY: number;

    /**
     * Scale Tranform
     *
     * Stretches or shrinks this Element along both the horizontal and
     * vertical axes.
     *
     * @defaultValue 1.0
     */
    scale: number;

    /**
     * Rotational Pivot Position (horizonal axis)
     *
     * Controls the pivot that the {@link rotation} property rotates around along
     * the horizontal axis.
     *
     * Examples:
     * - `0.0` = left
     * - `0.5` (default) = center
     * - `1.0` = right
     *
     * @defaultValue 0.5
     */
    pivotX: number;

    /**
     * Rotational Pivot Position (vertical axis)
     *
     * Controls the pivot that the {@link rotation} property rotates around along
     * both the vertical axes.
     *
     * Examples:
     * - `0.0` = top
     * - `0.5` (default) = center
     * - `1.0` = bottom
     *
    * @defaultValue 0.5
     */
    pivotY: number;
    /**
     * Rotational Pivot Position
     *
     * Controls the pivot that the {@link rotation} property rotates around along
     * both the horizontal and vertical axis.
     *
     * Examples:
     * - `0.0` = top-left
     * - `0.5` (default) = center
     * - `1.0` = bottom-right
     *
     * @defaultValue 0.5
     */
    pivot: number;

    /**
     * Texture mountpoint on horizontal axis
     *
     * Controls the position within the Element that is placed at {@link x} and
     * {@link y} along the horizontal axis.
     *
     * Examples:
     * - `0.0` (default) = left side
     * - `0.5` = center
     * - `1.0` = right side
     *
     * @defaultValue 0.0
     */
    mountX: number;

    /**
     * Texture mountpoint on vertical axis
     *
     * Controls the position within the Element that is placed at {@link x} and
     * {@link y} along the vertical axis.
     *
     * Examples:
     * - `0.0` (default) = top side
     * - `0.5` = center
     * - `1.0` = bottom side
     *
     * @defaultValue 0.0
     */
    mountY: number;

    /**
     * Texture mountpoint
     *
     * Controls the position within the Element that is placed at {@link x} and
     * {@link y} along both the horizontal and vertical axes.
     *
     * Examples:
     * - `0.0` (default) = top-left corner
     * - `0.5` = center
     * - `1.0` = bottom-right corner
     *
     * @default
     */
    mount: number;

    /**
     * Rotation Transform (in radians)
     *
     * Rotates this Element around the pivot (defined by {@link pivot}, {@link pivotX},
     * and {@link pivotY}).
     *
     * - `0.0` = No rotation
     * - `Math.PI / 2` = 90 degree rotation
     * - `Math.PI` = 180 degree rotation
     * - `Math.PI * 3 / 2` = 270 degree rotation
     * - `Math.PI * 2` = 360 degree rotation (same as no rotation)
     *
     * @defaultValue 0.0
     */
    rotation: number;

    /**
     * Defines the opacity of this Element and its descendants. This can be any number
     * between `0.0` (0% opacity) and `1.0` (100% opacity).
     *
     * - If set to `0.0`:
     *   - This Element is not rendered, but will still maintain its space in a Flex Box layout
     * - If set to `1.0` (default):
     *   - This Element is rendered with 100% opacity.
     *
     * @remarks
     *
     * The {@link visible} property takes prescendence over `alpha`.
     *
     * @defaultValue 1.0
     */
    alpha: number;

    /**
     * Defines the visibility of this Element and its descendents.
     *
     * - If set to `true` (default):
     *   - This Element is rendered.
     * - If set to `false`:
     *   - This Element is not rendered and its space in a Flex Box layout is collapsed.
     *
     * @remarks
     *
     * If an element is invisible, the off-screen Elements are invisible as well,
     * so you do not have to hide those manually to maintain a good performance.
     *
     * This property takes prescendence over the {@link alpha} property.
     *
     * @defaultValue true
     */
    visible: boolean;

    /**
     * Text settings / texture
     *
     * @remarks
     * When set, the Element adopts a `TextTexture` and renders the text / settings
     * laid out in this property.
     *
     * Cannot be set at the same time as {@link rect} or {@link src}.
     */
    text: TextTexture.Literal | string | null;

    /**
     * Set a shader on this Element
     */
    shader: Shader | Shader.Literal<typeof Shader> | null | undefined;

    /**
     * If set to `true`, enables Render-to-Texture mode on this Element
     *
     * @remarks
     * Render-to-Texture renders the children of this element to a seperate
     * texture before rendering it to screen. This allows shader effects to
     * work on an entire component as well as enabling advanced transformations
     * (like rotations).
     *
     * @defaultValue false
     */
    renderToTexture: boolean;

    /**
     * @see {@link renderToTexture}
     */
    rtt: boolean;

    /**
     * Determines if the texture is always updated or only when necessary.
     *
     * @defaultValue false
     */
    rttLazy: boolean;

    /**
     * ???
     */
    renderOffscreen: boolean;

    /**
     * ???
     */
    colorizeResultTexture: boolean;

    /**
     * Starts a smooth transition for all the included properties of the object
     *
     * @remarks
     * This is the same as calling {@link Element.setSmooth()} for each property.
     *
     * @see {@link Element.SmoothTemplate} for type details
     */
    smooth: SmoothTemplate;

    /**
     * Image source URI
     *
     * When set, this Element adopts an ImageTexture as its Texture
     * and loads/displays the image located at the URI.
     *
     * @remarks
     * Cannot be set at the same time as {@link rect} or {@link text}.
     */
    src: string | undefined;

    /**
     * The maximum expected texture source width.
     *
     * @remarks
     * Used for within bounds determination while texture is not yet loaded.
     *
     * If not set, 2048 is used by ElementCore.update()
     */
    mw: number;

    /**
     * The maximum expected texture source height.
     *
     * @remarks
     * Used for within bounds determination while texture is not yet loaded.
     *
     * If not set, 2048 is used by ElementCore.update()
     */
    mh: number;

    /**
     * Upper-left Corner Rectangle Color
     *
     * @see {@link color}
     */
    colorUl: number;

    /**
     * Upper-right Corner Rectangle Color
     *
     * @see {@link color}
     */
    colorUr: number;


    /**
     * Bottom-left Corner Rectangle Color
     *
     * @see {@link color}
     */
    colorBl: number;

    /**
     * Bottom-right Corner Rectangle Color
     *
     * @see {@link color}
     */
    colorBr: number;

    /**
     * Rectangle Color
     *
     * @remarks
     * This and the other `color*` properties are used to change the color of the
     * Element when {@link rect} is set to `true`.
     *
     * This property sets all of the corners/sides to the same color.
     */
    color: number;

    /**
     * Top Side Rectangle Color
     *
     * @see {@link color}
     */
    colorTop: number;

    /**
     * Bottom Side Rectangle Color
     *
     * @see {@link color}
     */
    colorBottom: number;

    /**
     * Left Side Rectangle Color
     *
     * @see {@link color}
     */
    colorLeft: number;

    /**
     * Right Side Rectangle Color
     *
     * @see {@link color}
     */
    colorRight: number;

    /**
     * ???
     */
    zIndex: number;

    /**
     * Defines whether clipping should be turned on or off for this element
     *
     * - If set to `true`:
     *   - Everything outside the dimensions of this Element is not
     *     rendered. (The effect is similar to overflow:hidden in CSS.)
     * - If set to `false` (default):
     *   - Everything outside the dimensions of this Element is rendered.
     *
     * @remarks
     *
     * Setting this property might increase the performance, as descendants outside the
     * clipping region are detected and not rendered.
     *
     * Clipping is implemented using the high-performance WebGL operation scissor. As a
     * consequence, clipping does not work for non-rectangular areas. So, if the Element
     * is rotated (by itself or by any of its ancestors), clipping is not applied. In such
     * situations, you can use the advanced `renderToTexture` property which applies clipping
     * as a side effect.
     *
     * @defaultValue false
     */
    clipping: boolean;

    /**
     * If set to `true` (default), does not render any of this Element's children if the
     * Element itself is completely out-of-bounds.
     *
     * Explicitly set this to `false` to enable rendering of children in that
     * situation.
     *
     * @defaultValue true
     */
    clipbox: boolean;

    /**
     * Set the children of this Element
     */
    children: Array<Element> | Array<{ [id: string]: any}>

    /**
     * Setup one or more transitions
     *
     * @remarks
     * This is the same as calling {@link Element.transition()} for each property.
     */
    transitions: TransitionsTemplate;

    /**
     * ???
     */
    onUpdate: OnUpdateCallback | undefined | null;

    /**
     * ???
     */
    onAfterCalcs: OnAfterCalcsCallback | undefined | null;

    /**
     * ???
     */
    onAfterUpdate: OnAfterUpdateCallback | undefined | null;
  }

  /**
   * Loose form of lng.Element.TemplateSpecStrong that allows any additional 'any' properties
   */
  export interface TemplateSpecLoose extends Element.TemplateSpecStrong {
    [s: string]: any
  }

  /**
   * Type used for patching an array of Elements/Compnents
   */
  export type PatchTemplateArray<T extends Element.Constructor = typeof Element> =
    T extends Component.Constructor
      ?
        Array<Component.NewPatchTemplate<T>>
      :
        Array<PatchTemplate<InstanceType<T>['__$type_TemplateSpec']>>;

  /**
   * Type used for patch() parameter.
   *
   * All TemplateSpec properties are made optional, including properties of nested TemplateSpecs.
   */
   export type PatchTemplate<TemplateSpecType extends Element.TemplateSpecStrong = Element.TemplateSpecLoose> = {
    [P in keyof TemplateSpecType]?:
      P extends ValidRef
        ?
          TemplateSpecType[P] extends Component.Constructor
            ?
              { type?: TemplateSpecType[P] } & PatchTemplate<InstanceType<TemplateSpecType[P]>['__$type_TemplateSpec']>
            :
              TemplateSpecType[P] extends Element.Constructor
                ?
                  PatchTemplate<InstanceType<TemplateSpecType[P]>['__$type_TemplateSpec']>
                :
                  PatchTemplate<InlineElement<TemplateSpecType[P]>>
        :
          TemplateSpecType[P]
  };

  /**
   * If `PossibleElementConstructor` is an inline Element or a Component Constructor, convert it to it's instantiated form.
   * Otherwise, return the input type (or something else by setting `Default`)
   *
   * @internal
   * @hidden
   */
  export type TransformPossibleElement<Key, PossibleElementConstructor, Default = PossibleElementConstructor> =
    string extends Key
      ?
        any // Support Loose Elements: keyof loose Elements `P` will always be a `string`, so let anything go
      :
        Key extends ValidRef // Support Strong Elements
          ?
            PossibleElementConstructor extends Element.Constructor
              ?
                InstanceType<PossibleElementConstructor>
              :
                Element<InlineElement<PossibleElementConstructor>>
          :
            Default;

  /**
   * Get an object containing all the Refs (child Element / Components) in a TemplateSpec
   */
  export type TemplateSpecRefs<TemplateSpec extends Element.TemplateSpecStrong> = {
    [P in keyof TemplateSpec as TransformPossibleElement<P, TemplateSpec[P], never> extends never ? never : P]:
      TransformPossibleElement<P, TemplateSpec[P], never>
  };

  /**
   * Extracts the input Element's TemplateSpec value
   */
  export type ExtractTemplateSpec<T extends Element = Element> = T['__$type_TemplateSpec'];

  export interface EventMap {
    /**
     * Texture Failed to Load
     *
     * @param error Error that occurred
     * @param textureSource Textured that fa
     */
    txError(error: Error, textureSource: TextureSource): void;
    /**
     * Texture Loaded
     *
     * @param texture
     */
    txLoaded: (texture: Texture) => void,
    /**
     * Texture Unloaded
     */
    txUnloaded: (texture: Texture) => void,
  }
}

/**
 * Allows all the documentation of Element.TemplateSpecStrong to be inherited by Element
 */
type Documentation = {
  [s in keyof Element.TemplateSpecStrong]: unknown;
}

declare class Element<
  // Elements use loose typing TemplateSpecs by default (for use of use as Elements aren't often fully definable)
  TemplateSpecType extends Element.TemplateSpecLoose = Element.TemplateSpecLoose,
  TextureType extends Texture = Texture,
  EventMap extends Element.EventMap = Element.EventMap
> extends EventEmitter<EventMap> implements Documentation {
  constructor(stage: Stage);

  readonly id: number;

  ref: string | undefined;

  readonly core: ElementCore;

  // setAsRoot() {
  // - Skipped as this seems very internal use

  readonly isRoot: boolean;

  /**
   * Gets the number of levels deep this Element is in the render tree.
   */
  getDepth(): number;

  /**
   * Gets the ancestor of this Element that is `l` levels back.
   *
   * @remarks
   * Examples:
   * - If `l` === 0:
   *   - Will return this Element
   * - If `l` === 1:
   *   - Will return this Element's parent
   * - If `l` === 2:
   *   - Will return this Element's grandparent
   *
   * @param l Number of levels to go back
   */
  getAncestor(l: number): Element | null;

  /**
   * Gets an array of this Element's ancestors (including this Element).
   *
   * Order:
   * ```text
   * [
   *   This Element,
   *   This Element's Parent,
   *   This Element's Grandparent,
   *   ... And so on
   * ]
   * ```
   */
  getAncestors(): Array<Element>;

  /**
   * Gets the ancestor of this Element that has the depth of `depth` in the render tree.
   *
   * - If `depth` === `0`:
   *   - Will return the root Element (generally the Application)
   * - If `depth` === `1`:
   *   - Will return the ancestor that is the child of the root Element
   * - If `depth` === `this.getDepth()`
   *   - Will return this Element
   *
   * @param depth Depth in the render tree from the root Element
   */
  getAncestorAtDepth(depth: number): void;

  /**
   * Returns true if this Element is an ancestor of Element `c`
   *
   * @param c Element to test
   */
  isAncestorOf(c: Element): boolean;

  /**
   * Gets the first common ancestor Element that this Element and another Element `c` share.
   *
   * - Returns `null` if there are no common ancestors
   *
   * @param c Element to find common ancestor with
   */
  getSharedAncestor(c: Element): Element | null;

  /**
   * Attached State
   *
   * @remarks
   * `true` if this {@link Element} is attached, otherwise `false`.
   *
   * @see {@link https://lightningjs.io/docs/#/lightning-core-reference/Components/LifecycleEvents?id=lifecycle-events|Lifecycle Events}
   */
  readonly attached: boolean;

  /**
   * Enabled State
   *
   * @remarks
   * `true` if this {@link Element} is enabled, otherwise `false`.
   *
   * @see {@link https://lightningjs.io/docs/#/lightning-core-reference/Components/LifecycleEvents?id=lifecycle-events|Lifecycle Events}
   */
  readonly enabled: boolean;

  /**
   * Active State
   *
   * @remarks
   * `true` if this {@link Element} is active, otherwise `false`.
   *
   * @see {@link https://lightningjs.io/docs/#/lightning-core-reference/Components/LifecycleEvents?id=lifecycle-events|Lifecycle Events}
   */
  readonly active: boolean;

  /**
   * Application's Global {@link Stage}
   */
  readonly stage: Stage;

  _onSetup(): void;

  _onAttach(): void;

  _onDetach(): void;

  _onEnabled(): void;

  _onDisabled(): void;

  _onActive(): void;

  _onInactive(): void;

  _onResize(): void;

  /**
   * ???
   */
  readonly renderWidth: number;

  /**
   * ???
   */
  readonly renderHeight: number;

  /**
   * ???
   */
  readonly finalX: number;

  /**
   * ???
   */
  readonly finalY: number;

  /**
   * ???
   */
  readonly finalW: number;

  /**
   * ???
   */
  readonly finalH: number;

  /**
   * Retruns `true` if a texture is currently loaded in this Element
   */
  textureIsLoaded(): boolean;

  /**
   * Load the texture that was set by {@link Element.TemplateSpecStrong.texture}
   */
  loadTexture(): void;

  /**
   * ???
   */
  forceZIndexContext: boolean;

  /**
   * ??? (make sure matches literal vesrion)
   *
   * @see {@link Element.TemplateSpecStrong.texture}
   */
  get texture(): TextureType | null;
  set texture(v: TextureType | Texture.Literal | null);

  /**
   * The currently displayed texture. While this.texture is loading,
   * this one may be different.
   */
  readonly displayedTexture: TextureType | null;

  // onTextureSourceLoaded() {
  // - Internal use only. Calling/overriding this can break things

  // onTextureSourceLoadError(error: unknown): void;
  // - Internal use only. Calling/overriding this can break things

  /**
   * Force re-create of render texture and re-invoke shader
   */
  forceRenderUpdate(): void;

  // onDisplayedTextureClippingChanged
  // - Internal use only. Calling/overriding this can break things

  // onPrecisionChanged
  // - Internal use only. Calling/overriding this can break things

  // onDimensionsChanged(w: number, h: number): void;
  // - Internal use only. Calling/overriding this can break things

  /**
   * Get the corner points of this Element
   *
   * Format:
   * ```
   * [
   *    topLeftX, topLeftY,
   *    topRightX, topRightY,
   *    bottomRightX, bottomRight,
   *    bottomLeftX, bottomLeftY
   * ]
   * ```
   */
  getCornerPoints(): [number, number, number, number, number, number, number, number];

  /**
   * Returns one of the Elements from the subtree that has this tag.
   *
   * @param tagName
   */
  tag<T extends Element = Element>(tagName: string): T | undefined;

  /**
   * Returns all Elements from the subtree that have this tag.
   *
   * @param tagName
   */
  mtag(tagName: string): Element[];

  // stag(tag, settings) {
  // - Not recommended

  tagRoot: boolean;

  // sel(path) {
  // select(path) {
  // - Complex and undocumented. Not recommended.

  /**
   * Get child directly by ref name
   *
   * @param ref
   */
  getByRef<RefKey extends keyof Element.TemplateSpecRefs<TemplateSpecType>>(ref: RefKey): Element.TemplateSpecRefs<TemplateSpecType>[RefKey] | undefined;

  /**
   * Get the location identifier of this Element???
   */
  getLocationString(): string;

  // toString() {
  // - This is inherent on any class

  // static getPrettyString(obj, indent: string): string;
  // - Utility method used by toString()

  /**
   * Get Settings object representing this Element
   */
  getSettings(): Element.TemplateSpecStrong;

  // getNonDefaults() {
  // - Internal use only

  /**
   * `true` if Element is within the bounds margin
   */
  readonly withinBoundsMargin: boolean;

  boundsMargin: [number, number, number, number] | null;

  /**
   * X position of this Element
   *
   * @see {@link Element.TemplateSpecStrong.x}
   */
  get x(): number;
  set x(x: number | ((parentWidth: number) => number));

  /**
   * Y position of this Element
   *
   * @see {@link Element.TemplateSpecStrong.y}
   */
  get y(): number;
  set y(y: number | ((parentHeight: number) => number));

  /**
   * Width of this Element
   *
   * @see {@link Element.TemplateSpecStrong.w}
   */
  get w(): number;
  set w(w: number | ((parentWidth: number) => number));

  /**
   * Height of this Element
   *
   * @see {@link Element.TemplateSpecStrong.h}
   */
  get h(): number;
  set h(h: number | ((parentHeight: number) => number));

  collision: boolean | 2;

  scaleX: number;

  scaleY: number;

  scale: number;

  pivotX: number;

  pivotY: number;

  pivot: number;

  mountX: number;

  mountY: number;

  mount: number;

  rotation: number;

  alpha: number;

  visible: boolean;

  colorUl: number;

  colorUr: number;

  colorBl: number;

  colorBr: number;

  color: number;

  colorTop: number;

  colorBottom: number;

  colorLeft: number;

  colorRight: number;

  zIndex: number;

  clipping: boolean;

  clipbox: boolean;

  readonly childList: ElementChildList;

  hasChildren(): boolean;

  /**
   * Set/get the children of this Element
   *
   * @see {@link Element.TemplateSpecStrong.children}
   */
  get children(): Array<Element>;
  set children(children: Array<Element> | Array<{ [id: string]: any }>);

  /**
   * Add element to end of this Element's childList
   *
   * @deprecated
   * While available this method calls this.childList.a(...) which is a slower method that
   * accepts a Template as input - since this is slower, it should be avoided.
   */
  add<T extends Element = Element>(
    element: Element.PatchTemplate | Array<Element.PatchTemplate | Element>,
  ): T;

  /**
   * @deprecated Duplicate of {@link parent}
   */
  readonly p: Element | null;

  /**
   * Parent Element of this Element
   */
  readonly parent: Element | null;

  src: string | undefined;

  /**
   * The maximum expected texture source width.
   *
   * @remarks
   * WARNING: DO NOT read from this property. It is WRITE-ONLY. It will return `undefined`.
   *
   * @see {@link Element.TemplateSpecStrong.mw}
   */
  mw: number;

  /**
   * The maximum expected texture source height.
   *
   * @remarks
   * WARNING: DO NOT read from this property. It is WRITE-ONLY. It will return `undefined`.
   *
   * @see {@link Element.TemplateSpecStrong.mh}
   */
  mh: number;

  rect: boolean;

  /**
   * Sets the TextTexture on this Element, replacing any already set texture
   */
  enableTextTexture(): TextTexture;

  /**
   * Text settings / texture
   *
   * @remarks
   * WARNING: You may ONLY set `TextTexture.Literal | string` to this property
   *
   * Note: This property will always return `TextTexture | null` when read.
   *
   * @see {@link Element.TemplateSpecStrong.text}
   */
  // @ts-ignore-error Prevent ts(2380)
  get text(): TextTexture | null;
  set text(text: TextTexture.Literal | string);

  /**
   * ??? (make sure matches literal version)
   *
   * @remarks
   * Note: This property will always return `undefined` when read.
   *
   * @see {@link Element.TemplateSpecStrong.onAfterUpdate}
   */
  onUpdate: Element.OnUpdateCallback | null | undefined;

  /**
   * ??? (make sure matches literal version)
   *
   * @remarks
   * Note: This property will always return `undefined` when read.
   *
   * @see {@link Element.TemplateSpecStrong.onAfterUpdate}
   */
  onAfterCalcs: Element.OnAfterCalcsCallback | null | undefined;

  /**
   * ??? (make sure matches literal version)
   *
   * @remarks
   * Note: This property will always return `undefined` when read.
   *
   * @see {@link Element.TemplateSpecStrong.onAfterUpdate}
   */
  onAfterUpdate: Element.OnAfterUpdateCallback | null | undefined;

  /**
   * Forces an update loop.
   */
  forceUpdate(): void;

  /**
   * Get/set a shader of/on this Element
   *
   * @see {@link Element.TemplateSpecStrong.shader}
   */
  get shader(): Shader | Shader.Literal<typeof Shader> | null;
  set shader(v: Shader | Shader.Literal<typeof Shader> | null | undefined);

  renderToTexture: boolean;

  rtt: boolean;

  rttLazy: boolean;

  renderOffscreen: boolean;

  colorizeResultTexture: boolean;

  getTexture(): TextureSource;

  readonly texturizer: ElementTexturizer;

  /**
   * ???
   *
   * @param template
   */
  patch(template: Element.PatchTemplate<TemplateSpecType>): void;

  animation(animation: AnimationSettings.Literal): Animation;

  /***
   * ???
   */
  transition(property: string): Transition;

  /**
   * ???
   *
   * @param property
   * @param settings
   */
  transition(property: string, settings: TransitionSettings.Literal): null;

  /**
   * Setup one or more transitions
   *
   * @remarks
   * WARNING: DO NOT read from this property. It is WRITE-ONLY. It will return `undefined`.
   *
   * @see {@link Element.TemplateSpecStrong.transitions}
   */
  // @ts-ignore-error Prevent ts(2380)
  get transitions(): undefined;
  set transitions(v: Element.TransitionsTemplate<Element.TemplateSpecStrong>);

  /**
   * Starts a smooth transition for all the included properties of the object
   *
   * @see {@link Element.TemplateSpecStrong.smooth}
   */
  // The getter type needs to have SmoothLiteral in its union for some reason thats not clear
  // @ts-ignore-error Prevent ts(2380)
  get smooth(): Element.SmoothTemplate<TemplateSpecType> | undefined;
  set smooth(object: Element.SmoothTemplate<TemplateSpecType>);

  /**
   * Fast-forward a currently transitioning property to its target value
   * immediately.
   *
   * @remarks
   * This method also supports providing a property path (i.e. `'texture.x'`). To do
   * this within a strongly typed Element / Component you can do so with an explicit
   * `as any`.
   *
   * ```ts
   * strongElement.fastForward('texture.x' as any);
   * ```
   *
   * @param property
   */
  fastForward<Key extends keyof Element.SmoothTemplate<TemplateSpecType>>(
    property: number extends TemplateSpecType[Key] ? Key : never
  ): void;

  /**
   * Get the current target value of an active transition.
   *
   * - If `property` is not actively transitioning:
   *   - Returns `value`, if provided.
   *   - Otherwise, returns `undefined`.
   *
   * @remarks
   * This method also supports providing a property path (i.e. `'texture.x'`). To do
   * this within a strongly typed Element / Component you can do so with an explicit
   * `as any`.
   *
   * ```ts
   * strongElement.getSmooth('texture.x' as any);
   * ```
   *
   * @param property
   * @param value
   */
  getSmooth<Key extends keyof Element.SmoothTemplate<TemplateSpecType>>(
    property: number extends TemplateSpecType[Key] ? Key : never
  ): number | undefined;
  getSmooth<Key extends keyof Element.SmoothTemplate<TemplateSpecType>>(
    property: Key,
    value: number extends TemplateSpecType[Key] ? number : never,
  ): number extends TemplateSpecType[Key] ? number : never;

  /**
   * Start a smooth transition of `property` to the target `value`. Optionally
   * you may provide transition `settings`. If `settings` is not provided the
   * default transition will be used.
   *
   * @remarks
   * This method also supports transitioning a property path (i.e. `'texture.x'`). To do
   * this within a strongly typed Element / Component you can do so with an explicit
   * `as any`.
   *
   * ```ts
   * strongElement.setSmooth('texture.x' as any, 123);
   * ```
   *
   * @param property Property to transition
   * @param value Target value
   * @param settings Transition settings
   */
  setSmooth<Key extends keyof Element.SmoothTemplate<TemplateSpecType>>(
    property: Key,
    value: number extends TemplateSpecType[Key] ? number : never,
    settings?: TransitionSettings.Literal,
  ): void;

  flex: Element.Flex;

  flexItem: Element.FlexItem;
  //toJSON() { !!!!
  //static collectChildren(tree, children) {
  //static getProperties(element) {

  /**
   * Phantom type that holds the LiteralType.
   *
   * NOT AVAILABLE AT RUNTIME.
   */
  readonly __$type_TemplateSpec: TemplateSpecType & { smooth: Element.SmoothTemplate<TemplateSpecType> };

  // Purposely not exposed:
  // getTags();
  // setTags(tags);
  // addTag(tag);
  // removeTag(tag);
  // hasTag(tag);
  // get tags() {
  // set tags(v) {
  // set t(v) {
  // - These tag related methods/properties seem very internal use only and it's not clear if there's a
  //   practical external use
  // static getGetter(propertyPath) {
  // static getSetter(propertyPath) {
  // _allowChildrenAccess() {
  // - This seems to have limited utility for overriding
  // static isColorProperty(property)
  // static getMerger(property)
  // - These are used solely by Transitions with no likely external utility
}

export default Element;
