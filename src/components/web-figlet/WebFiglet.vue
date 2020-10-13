<template>
  <div id="web-figlet" class="tool-main-normal">
    <h1 class="tool-h1-normal">
      <tool-normal-home-btn></tool-normal-home-btn>
      FIGlet
    </h1>

    <!-- 输入框 -->
    <div class="source-text-container">
      <el-input
        v-model="sourceText"
        @input="refreshTargetText">
        <el-select
          slot="prepend"
          v-model="selectedFont"
          @input="refreshTargetText"
          style="width: 110px;">
          <el-option
            v-for="font in figletFonts"
            :key="font"
            :label="font"
            :value="font">
          </el-option>
        </el-select>
      </el-input>
    </div>

    <!-- 字体大小调节 -->
    <div class="target-text-size-slider-container">
      <el-slider
        class="target-text-size-slider"
        v-model="targetTextSize"
        :format-tooltip="targetTextSizeSliderTooltip">
      </el-slider>
    </div>

    <!-- 结果展示框 -->
    <div class="target-text-container">
      <div class="copy-btn-container">
        <i
          title="复制"
          class="el-icon-copy-document copy-btn"
          :data-clipboard-text="targetText"
          @click="alertCopy">
        </i>
      </div>
      <pre class="target-text" :style="{'font-size': (targetTextSize / 100 * 48 + 12) + 'px'}">{{ targetText }}</pre>
    </div>

  </div>
</template>

<script>
import Clipboard from 'clipboard'
import ToolNormalHomeBtn from '@/libs/ToolNormalHomeBtn'

import * as figlet from 'figlet'

// 基础字体
import banner from 'figlet/importable-fonts/Banner'
import block from 'figlet/importable-fonts/Block'
import digital from 'figlet/importable-fonts/Digital'
import lean from 'figlet/importable-fonts/Lean'
import mnemonic from 'figlet/importable-fonts/Mnemonic'
import shadow from 'figlet/importable-fonts/Shadow'
import small from 'figlet/importable-fonts/Small'
import smshadow from 'figlet/importable-fonts/Small Shadow'
import standard from 'figlet/importable-fonts/Standard'
import big from 'figlet/importable-fonts/Big'
import bubble from 'figlet/importable-fonts/Bubble'
import ivrit from 'figlet/importable-fonts/Ivrit'
import mini from 'figlet/importable-fonts/Mini'
import script from 'figlet/importable-fonts/Script'
import slant from 'figlet/importable-fonts/Slant'
import smscript from 'figlet/importable-fonts/Small Script'
import smslant from 'figlet/importable-fonts/Small Slant'
import term from 'figlet/importable-fonts/Term'

// 附加字体
import oneRow from 'figlet/importable-fonts/1Row'
import threeD from 'figlet/importable-fonts/3-D'
import threeDDiagonal from 'figlet/importable-fonts/3D Diagonal'
import threeDAscii from 'figlet/importable-fonts/3D-ASCII'
import threeX5 from 'figlet/importable-fonts/3x5'
import fourMax from 'figlet/importable-fonts/4Max'
import fiveLineOblique from 'figlet/importable-fonts/5 Line Oblique'
import acrobatic from 'figlet/importable-fonts/Acrobatic'
import alligator from 'figlet/importable-fonts/Alligator'
import alligator2 from 'figlet/importable-fonts/Alligator2'
import alpha from 'figlet/importable-fonts/Alpha'
import alphabet from 'figlet/importable-fonts/Alphabet'
import amc3Line from 'figlet/importable-fonts/AMC 3 Line'
import amc3Liv1 from 'figlet/importable-fonts/AMC 3 Liv1'
import amcAaa01 from 'figlet/importable-fonts/AMC AAA01'
import amcNeko from 'figlet/importable-fonts/AMC Neko'
import amcRazor from 'figlet/importable-fonts/AMC Razor'
import amcRazor2 from 'figlet/importable-fonts/AMC Razor2'
import amcSlash from 'figlet/importable-fonts/AMC Slash'
import amcSlider from 'figlet/importable-fonts/AMC Slider'
import amcThin from 'figlet/importable-fonts/AMC Thin'
import amcTubes from 'figlet/importable-fonts/AMC Tubes'
import amcUntitled from 'figlet/importable-fonts/AMC Untitled'
import ansiRegular from 'figlet/importable-fonts/ANSI Regular'
import ansiShadow from 'figlet/importable-fonts/ANSI Shadow'
import arrows from 'figlet/importable-fonts/Arrows'
import asciiNewRoman from 'figlet/importable-fonts/ASCII New Roman'
import avatar from 'figlet/importable-fonts/Avatar'
import b1Ff from 'figlet/importable-fonts/B1FF'
import banner3D from 'figlet/importable-fonts/Banner3-D'
import banner3 from 'figlet/importable-fonts/Banner3'
import banner4 from 'figlet/importable-fonts/Banner4'
import barbwire from 'figlet/importable-fonts/Barbwire'
import basic from 'figlet/importable-fonts/Basic'
import bear from 'figlet/importable-fonts/Bear'
import bell from 'figlet/importable-fonts/Bell'
import benjamin from 'figlet/importable-fonts/Benjamin'
import bigChief from 'figlet/importable-fonts/Big Chief'
import bigMoneyNe from 'figlet/importable-fonts/Big Money-ne'
import bigMoneyNw from 'figlet/importable-fonts/Big Money-nw'
import bigMoneySe from 'figlet/importable-fonts/Big Money-se'
import bigMoneySw from 'figlet/importable-fonts/Big Money-sw'
import bigfig from 'figlet/importable-fonts/Bigfig'
import binary from 'figlet/importable-fonts/Binary'
import blocks from 'figlet/importable-fonts/Blocks'
import bloody from 'figlet/importable-fonts/Bloody'
import bolger from 'figlet/importable-fonts/Bolger'
import braced from 'figlet/importable-fonts/Braced'
import bright from 'figlet/importable-fonts/Bright'
import broadwayKb from 'figlet/importable-fonts/Broadway KB'
import broadway from 'figlet/importable-fonts/Broadway'
import bulbhead from 'figlet/importable-fonts/Bulbhead'
import caligraphy from 'figlet/importable-fonts/Caligraphy'
import caligraphy2 from 'figlet/importable-fonts/Caligraphy2'
import calvinS from 'figlet/importable-fonts/Calvin S'
import cards from 'figlet/importable-fonts/Cards'
import catwalk from 'figlet/importable-fonts/Catwalk'
import chiseled from 'figlet/importable-fonts/Chiseled'
import chunky from 'figlet/importable-fonts/Chunky'
import coinstak from 'figlet/importable-fonts/Coinstak'
import cola from 'figlet/importable-fonts/Cola'
import colossal from 'figlet/importable-fonts/Colossal'
import computer from 'figlet/importable-fonts/Computer'
import contessa from 'figlet/importable-fonts/Contessa'
import contrast from 'figlet/importable-fonts/Contrast'
import cosmike from 'figlet/importable-fonts/Cosmike'
import crawford from 'figlet/importable-fonts/Crawford'
import crawford2 from 'figlet/importable-fonts/Crawford2'
import crazy from 'figlet/importable-fonts/Crazy'
import cricket from 'figlet/importable-fonts/Cricket'
import cursive from 'figlet/importable-fonts/Cursive'
import cyberlarge from 'figlet/importable-fonts/Cyberlarge'
import cybermedium from 'figlet/importable-fonts/Cybermedium'
import cybersmall from 'figlet/importable-fonts/Cybersmall'
import cygnet from 'figlet/importable-fonts/Cygnet'
import danc4 from 'figlet/importable-fonts/DANC4'
import dancingFont from 'figlet/importable-fonts/Dancing Font'
import decimal from 'figlet/importable-fonts/Decimal'
import defLeppard from 'figlet/importable-fonts/Def Leppard'
import deltaCorpsPriest1 from 'figlet/importable-fonts/Delta Corps Priest 1'
import diamond from 'figlet/importable-fonts/Diamond'
import dietCola from 'figlet/importable-fonts/Diet Cola'
import doh from 'figlet/importable-fonts/Doh'
import doom from 'figlet/importable-fonts/Doom'
import dosRebel from 'figlet/importable-fonts/DOS Rebel'
import dotMatrix from 'figlet/importable-fonts/Dot Matrix'
import doubleShorts from 'figlet/importable-fonts/Double Shorts'
import double from 'figlet/importable-fonts/Double'
import drPepper from 'figlet/importable-fonts/Dr Pepper'
import dwhistled from 'figlet/importable-fonts/DWhistled'
import eftiChess from 'figlet/importable-fonts/Efti Chess'
import eftiFont from 'figlet/importable-fonts/Efti Font'
import eftiItalic from 'figlet/importable-fonts/Efti Italic'
import eftiPiti from 'figlet/importable-fonts/Efti Piti'
import eftiRobot from 'figlet/importable-fonts/Efti Robot'
import eftiWall from 'figlet/importable-fonts/Efti Wall'
import eftiWater from 'figlet/importable-fonts/Efti Water'
import electronic from 'figlet/importable-fonts/Electronic'
import elite from 'figlet/importable-fonts/Elite'
import epic from 'figlet/importable-fonts/Epic'
import fender from 'figlet/importable-fonts/Fender'
import filter from 'figlet/importable-fonts/Filter'
import fireFontK from 'figlet/importable-fonts/Fire Font-k'
import fireFontS from 'figlet/importable-fonts/Fire Font-s'
import flipped from 'figlet/importable-fonts/Flipped'
import flowerPower from 'figlet/importable-fonts/Flower Power'
import fourTops from 'figlet/importable-fonts/Four Tops'
import fraktur from 'figlet/importable-fonts/Fraktur'
import funFace from 'figlet/importable-fonts/Fun Face'
import funFaces from 'figlet/importable-fonts/Fun Faces'
import fuzzy from 'figlet/importable-fonts/Fuzzy'
import georgi16 from 'figlet/importable-fonts/Georgi16'
import georgia11 from 'figlet/importable-fonts/Georgia11'
import ghost from 'figlet/importable-fonts/Ghost'
import ghoulish from 'figlet/importable-fonts/Ghoulish'
import glenyn from 'figlet/importable-fonts/Glenyn'
import goofy from 'figlet/importable-fonts/Goofy'
import gothic from 'figlet/importable-fonts/Gothic'
import graceful from 'figlet/importable-fonts/Graceful'
import gradient from 'figlet/importable-fonts/Gradient'
import graffiti from 'figlet/importable-fonts/Graffiti'
import greek from 'figlet/importable-fonts/Greek'
import heartLeft from 'figlet/importable-fonts/Heart Left'
import heartRight from 'figlet/importable-fonts/Heart Right'
import henry3D from 'figlet/importable-fonts/Henry 3D'
import hex from 'figlet/importable-fonts/Hex'
import hieroglyphs from 'figlet/importable-fonts/Hieroglyphs'
import hollywood from 'figlet/importable-fonts/Hollywood'
import horizontalLeft from 'figlet/importable-fonts/Horizontal Left'
import horizontalRight from 'figlet/importable-fonts/Horizontal Right'
import icl1900 from 'figlet/importable-fonts/ICL-1900'
import impossible from 'figlet/importable-fonts/Impossible'
import invita from 'figlet/importable-fonts/Invita'
import isometric1 from 'figlet/importable-fonts/Isometric1'
import isometric2 from 'figlet/importable-fonts/Isometric2'
import isometric3 from 'figlet/importable-fonts/Isometric3'
import isometric4 from 'figlet/importable-fonts/Isometric4'
import italic from 'figlet/importable-fonts/Italic'
import jacky from 'figlet/importable-fonts/Jacky'
import jazmine from 'figlet/importable-fonts/Jazmine'
import jerusalem from 'figlet/importable-fonts/Jerusalem'
import jsBlockLetters from 'figlet/importable-fonts/JS Block Letters'
import jsBracketLetters from 'figlet/importable-fonts/JS Bracket Letters'
import jsCapitalCurves from 'figlet/importable-fonts/JS Capital Curves'
import jsCursive from 'figlet/importable-fonts/JS Cursive'
import jsStickLetters from 'figlet/importable-fonts/JS Stick Letters'
import katakana from 'figlet/importable-fonts/Katakana'
import kban from 'figlet/importable-fonts/Kban'
import keyboard from 'figlet/importable-fonts/Keyboard'
import knob from 'figlet/importable-fonts/Knob'
import kontoSlant from 'figlet/importable-fonts/Konto Slant'
import konto from 'figlet/importable-fonts/Konto'
import larry3D2 from 'figlet/importable-fonts/Larry 3D 2'
import larry3D from 'figlet/importable-fonts/Larry 3D'
import lcd from 'figlet/importable-fonts/LCD'
import letters from 'figlet/importable-fonts/Letters'
import lilDevil from 'figlet/importable-fonts/Lil Devil'
import lineBlocks from 'figlet/importable-fonts/Line Blocks'
import linux from 'figlet/importable-fonts/Linux'
import lockergnome from 'figlet/importable-fonts/Lockergnome'
import madrid from 'figlet/importable-fonts/Madrid'
import marquee from 'figlet/importable-fonts/Marquee'
import maxfour from 'figlet/importable-fonts/Maxfour'
import merlin1 from 'figlet/importable-fonts/Merlin1'
import merlin2 from 'figlet/importable-fonts/Merlin2'
import mike from 'figlet/importable-fonts/Mike'
import mirror from 'figlet/importable-fonts/Mirror'
import modular from 'figlet/importable-fonts/Modular'
import morse from 'figlet/importable-fonts/Morse'
import morse2 from 'figlet/importable-fonts/Morse2'
import moscow from 'figlet/importable-fonts/Moscow'
import mshebrew210 from 'figlet/importable-fonts/Mshebrew210'
import muzzle from 'figlet/importable-fonts/Muzzle'
import nancyjFancy from 'figlet/importable-fonts/Nancyj-Fancy'
import nancyjImproved from 'figlet/importable-fonts/Nancyj-Improved'
import nancyjUnderlined from 'figlet/importable-fonts/Nancyj-Underlined'
import nancyj from 'figlet/importable-fonts/Nancyj'
import nipples from 'figlet/importable-fonts/Nipples'
import nscript from 'figlet/importable-fonts/NScript'
import ntGreek from 'figlet/importable-fonts/NT Greek'
import nvScript from 'figlet/importable-fonts/NV Script'
import o8 from 'figlet/importable-fonts/O8'
import octal from 'figlet/importable-fonts/Octal'
import ogre from 'figlet/importable-fonts/Ogre'
import oldBanner from 'figlet/importable-fonts/Old Banner'
import os2 from 'figlet/importable-fonts/OS2'
import pagga from 'figlet/importable-fonts/Pagga'
import patorjkCheese from 'figlet/importable-fonts/Patorjk\'s Cheese'
import patorjkHex from 'figlet/importable-fonts/Patorjk-HeX'
import pawp from 'figlet/importable-fonts/Pawp'
import peaksSlant from 'figlet/importable-fonts/Peaks Slant'
import peaks from 'figlet/importable-fonts/Peaks'
import pebbles from 'figlet/importable-fonts/Pebbles'
import pepper from 'figlet/importable-fonts/Pepper'
import poison from 'figlet/importable-fonts/Poison'
import puffy from 'figlet/importable-fonts/Puffy'
import puzzle from 'figlet/importable-fonts/Puzzle'
import pyramid from 'figlet/importable-fonts/Pyramid'
import rammstein from 'figlet/importable-fonts/Rammstein'
import rectangles from 'figlet/importable-fonts/Rectangles'
import redPhoenix from 'figlet/importable-fonts/Red Phoenix'
import relief from 'figlet/importable-fonts/Relief'
import relief2 from 'figlet/importable-fonts/Relief2'
import reverse from 'figlet/importable-fonts/Reverse'
import roman from 'figlet/importable-fonts/Roman'
import rot13 from 'figlet/importable-fonts/Rot13'
import rotated from 'figlet/importable-fonts/Rotated'
import rounded from 'figlet/importable-fonts/Rounded'
import rowanCap from 'figlet/importable-fonts/Rowan Cap'
import rozzo from 'figlet/importable-fonts/Rozzo'
import runic from 'figlet/importable-fonts/Runic'
import runyc from 'figlet/importable-fonts/Runyc'
import sBlood from 'figlet/importable-fonts/S Blood'
import santaClara from 'figlet/importable-fonts/Santa Clara'
import serifcap from 'figlet/importable-fonts/Serifcap'
import shimrod from 'figlet/importable-fonts/Shimrod'
import short from 'figlet/importable-fonts/Short'
import slScript from 'figlet/importable-fonts/SL Script'
import slantRelief from 'figlet/importable-fonts/Slant Relief'
import slide from 'figlet/importable-fonts/Slide'
import smallCaps from 'figlet/importable-fonts/Small Caps'
import smallIsometric1 from 'figlet/importable-fonts/Small Isometric1'
import smallKeyboard from 'figlet/importable-fonts/Small Keyboard'
import smallPoison from 'figlet/importable-fonts/Small Poison'
import smallTengwar from 'figlet/importable-fonts/Small Tengwar'
import soft from 'figlet/importable-fonts/Soft'
import speed from 'figlet/importable-fonts/Speed'
import spliff from 'figlet/importable-fonts/Spliff'
import stacey from 'figlet/importable-fonts/Stacey'
import stampate from 'figlet/importable-fonts/Stampate'
import stampatello from 'figlet/importable-fonts/Stampatello'
import starStrips from 'figlet/importable-fonts/Star Strips'
import starWars from 'figlet/importable-fonts/Star Wars'
import stellar from 'figlet/importable-fonts/Stellar'
import stforek from 'figlet/importable-fonts/Stforek'
import stickLetters from 'figlet/importable-fonts/Stick Letters'
import stop from 'figlet/importable-fonts/Stop'
import straight from 'figlet/importable-fonts/Straight'
import strongerThanAll from 'figlet/importable-fonts/Stronger Than All'
import subZero from 'figlet/importable-fonts/Sub-Zero'
import swampLand from 'figlet/importable-fonts/Swamp Land'
import swan from 'figlet/importable-fonts/Swan'
import sweet from 'figlet/importable-fonts/Sweet'
import tanja from 'figlet/importable-fonts/Tanja'
import tengwar from 'figlet/importable-fonts/Tengwar'
import test1 from 'figlet/importable-fonts/Test1'
import theEdge from 'figlet/importable-fonts/The Edge'
import thick from 'figlet/importable-fonts/Thick'
import thin from 'figlet/importable-fonts/Thin'
import thisFont from 'figlet/importable-fonts/THIS'
import thorned from 'figlet/importable-fonts/Thorned'
import threePoint from 'figlet/importable-fonts/Three Point'
import ticksSlant from 'figlet/importable-fonts/Ticks Slant'
import ticks from 'figlet/importable-fonts/Ticks'
import tiles from 'figlet/importable-fonts/Tiles'
import tinkerToy from 'figlet/importable-fonts/Tinker-Toy'
import tombstone from 'figlet/importable-fonts/Tombstone'
import train from 'figlet/importable-fonts/Train'
import trek from 'figlet/importable-fonts/Trek'
import tsalagi from 'figlet/importable-fonts/Tsalagi'
import tubular from 'figlet/importable-fonts/Tubular'
import twisted from 'figlet/importable-fonts/Twisted'
import twoPoint from 'figlet/importable-fonts/Two Point'
import univers from 'figlet/importable-fonts/Univers'
import usaFlag from 'figlet/importable-fonts/USA Flag'
import varsity from 'figlet/importable-fonts/Varsity'
import wavy from 'figlet/importable-fonts/Wavy'
import weird from 'figlet/importable-fonts/Weird'
import wetLetter from 'figlet/importable-fonts/Wet Letter'
import whimsy from 'figlet/importable-fonts/Whimsy'
import wow from 'figlet/importable-fonts/Wow'

export default {
  name: 'WebFiglet',
  components: { ToolNormalHomeBtn },
  data () {
    return {
      figletReadied: false,
      figletFonts: [],
      sourceText: 'Hello World!',
      selectedFont: 'standard',
      targetText: '',
      targetTextSize: 16,
      clipboard: new Clipboard('.copy-btn')
    }
  },
  mounted () {
    this.parseFigletFont()
    this.figletReadied = true
    this.refreshTargetText()
    console.log(figlet.textSync('FIGlet READY!', 'slant'))
  },
  methods: {
    refreshTargetText () {
      this.targetText = figlet.textSync(this.sourceText, this.selectedFont)
    },
    parseFigletFont () {
      let fonts = {
        // 基础字体
        banner: banner,
        block: block,
        digital: digital,
        lean: lean,
        mnemonic: mnemonic,
        shadow: shadow,
        small: small,
        smshadow: smshadow,
        standard: standard,
        big: big,
        bubble: bubble,
        ivrit: ivrit,
        mini: mini,
        script: script,
        slant: slant,
        smscript: smscript,
        smslant: smslant,
        term: term,

        // 附加字体
        '1Row': oneRow,
        '3-D': threeD,
        '3D Diagonal': threeDDiagonal,
        '3D-ASCII': threeDAscii,
        '3x5': threeX5,
        '4Max': fourMax,
        '5 Line Oblique': fiveLineOblique,
        'Acrobatic': acrobatic,
        'Alligator': alligator,
        'Alligator2': alligator2,
        'Alpha': alpha,
        'Alphabet': alphabet,
        'AMC 3 Line': amc3Line,
        'AMC 3 Liv1': amc3Liv1,
        'AMC AAA01': amcAaa01,
        'AMC Neko': amcNeko,
        'AMC Razor': amcRazor,
        'AMC Razor2': amcRazor2,
        'AMC Slash': amcSlash,
        'AMC Slider': amcSlider,
        'AMC Thin': amcThin,
        'AMC Tubes': amcTubes,
        'AMC Untitled': amcUntitled,
        'ANSI Regular': ansiRegular,
        'ANSI Shadow': ansiShadow,
        'Arrows': arrows,
        'ASCII New Roman': asciiNewRoman,
        'Avatar': avatar,
        'B1FF': b1Ff,
        'Banner3-D': banner3D,
        'Banner3': banner3,
        'Banner4': banner4,
        'Barbwire': barbwire,
        'Basic': basic,
        'Bear': bear,
        'Bell': bell,
        'Benjamin': benjamin,
        'Big Chief': bigChief,
        'Big Money-ne': bigMoneyNe,
        'Big Money-nw': bigMoneyNw,
        'Big Money-se': bigMoneySe,
        'Big Money-sw': bigMoneySw,
        'Bigfig': bigfig,
        'Binary': binary,
        'Blocks': blocks,
        'Bloody': bloody,
        'Bolger': bolger,
        'Braced': braced,
        'Bright': bright,
        'Broadway KB': broadwayKb,
        'Broadway': broadway,
        'Bulbhead': bulbhead,
        'Caligraphy': caligraphy,
        'Caligraphy2': caligraphy2,
        'Calvin S': calvinS,
        'Cards': cards,
        'Catwalk': catwalk,
        'Chiseled': chiseled,
        'Chunky': chunky,
        'Coinstak': coinstak,
        'Cola': cola,
        'Colossal': colossal,
        'Computer': computer,
        'Contessa': contessa,
        'Contrast': contrast,
        'Cosmike': cosmike,
        'Crawford': crawford,
        'Crawford2': crawford2,
        'Crazy': crazy,
        'Cricket': cricket,
        'Cursive': cursive,
        'Cyberlarge': cyberlarge,
        'Cybermedium': cybermedium,
        'Cybersmall': cybersmall,
        'Cygnet': cygnet,
        'DANC4': danc4,
        'Dancing Font': dancingFont,
        'Decimal': decimal,
        'Def Leppard': defLeppard,
        'Delta Corps Priest 1': deltaCorpsPriest1,
        'Diamond': diamond,
        'Diet Cola': dietCola,
        'Doh': doh,
        'Doom': doom,
        'DOS Rebel': dosRebel,
        'Dot Matrix': dotMatrix,
        'Double Shorts': doubleShorts,
        'Double': double,
        'Dr Pepper': drPepper,
        'DWhistled': dwhistled,
        'Efti Chess': eftiChess,
        'Efti Font': eftiFont,
        'Efti Italic': eftiItalic,
        'Efti Piti': eftiPiti,
        'Efti Robot': eftiRobot,
        'Efti Wall': eftiWall,
        'Efti Water': eftiWater,
        'Electronic': electronic,
        'Elite': elite,
        'Epic': epic,
        'Fender': fender,
        'Filter': filter,
        'Fire Font-k': fireFontK,
        'Fire Font-s': fireFontS,
        'Flipped': flipped,
        'Flower Power': flowerPower,
        'Four Tops': fourTops,
        'Fraktur': fraktur,
        'Fun Face': funFace,
        'Fun Faces': funFaces,
        'Fuzzy': fuzzy,
        'Georgi16': georgi16,
        'Georgia11': georgia11,
        'Ghost': ghost,
        'Ghoulish': ghoulish,
        'Glenyn': glenyn,
        'Goofy': goofy,
        'Gothic': gothic,
        'Graceful': graceful,
        'Gradient': gradient,
        'Graffiti': graffiti,
        'Greek': greek,
        'Heart Left': heartLeft,
        'Heart Right': heartRight,
        'Henry 3D': henry3D,
        'Hex': hex,
        'Hieroglyphs': hieroglyphs,
        'Hollywood': hollywood,
        'Horizontal Left': horizontalLeft,
        'Horizontal Right': horizontalRight,
        'ICL-1900': icl1900,
        'Impossible': impossible,
        'Invita': invita,
        'Isometric1': isometric1,
        'Isometric2': isometric2,
        'Isometric3': isometric3,
        'Isometric4': isometric4,
        'Italic': italic,
        'Jacky': jacky,
        'Jazmine': jazmine,
        'Jerusalem': jerusalem,
        'JS Block Letters': jsBlockLetters,
        'JS Bracket Letters': jsBracketLetters,
        'JS Capital Curves': jsCapitalCurves,
        'JS Cursive': jsCursive,
        'JS Stick Letters': jsStickLetters,
        'Katakana': katakana,
        'Kban': kban,
        'Keyboard': keyboard,
        'Knob': knob,
        'Konto Slant': kontoSlant,
        'Konto': konto,
        'Larry 3D 2': larry3D2,
        'Larry 3D': larry3D,
        'LCD': lcd,
        'Letters': letters,
        'Lil Devil': lilDevil,
        'Line Blocks': lineBlocks,
        'Linux': linux,
        'Lockergnome': lockergnome,
        'Madrid': madrid,
        'Marquee': marquee,
        'Maxfour': maxfour,
        'Merlin1': merlin1,
        'Merlin2': merlin2,
        'Mike': mike,
        'Mirror': mirror,
        'Modular': modular,
        'Morse': morse,
        'Morse2': morse2,
        'Moscow': moscow,
        'Mshebrew210': mshebrew210,
        'Muzzle': muzzle,
        'Nancyj-Fancy': nancyjFancy,
        'Nancyj-Improved': nancyjImproved,
        'Nancyj-Underlined': nancyjUnderlined,
        'Nancyj': nancyj,
        'Nipples': nipples,
        'NScript': nscript,
        'NT Greek': ntGreek,
        'NV Script': nvScript,
        'O8': o8,
        'Octal': octal,
        'Ogre': ogre,
        'Old Banner': oldBanner,
        'OS2': os2,
        'Pagga': pagga,
        'Patorjk\'s Cheese': patorjkCheese,
        'Patorjk-HeX': patorjkHex,
        'Pawp': pawp,
        'Peaks Slant': peaksSlant,
        'Peaks': peaks,
        'Pebbles': pebbles,
        'Pepper': pepper,
        'Poison': poison,
        'Puffy': puffy,
        'Puzzle': puzzle,
        'Pyramid': pyramid,
        'Rammstein': rammstein,
        'Rectangles': rectangles,
        'Red Phoenix': redPhoenix,
        'Relief': relief,
        'Relief2': relief2,
        'Reverse': reverse,
        'Roman': roman,
        'Rot13': rot13,
        'Rotated': rotated,
        'Rounded': rounded,
        'Rowan Cap': rowanCap,
        'Rozzo': rozzo,
        'Runic': runic,
        'Runyc': runyc,
        'S Blood': sBlood,
        'Santa Clara': santaClara,
        'Serifcap': serifcap,
        'Shimrod': shimrod,
        'Short': short,
        'SL Script': slScript,
        'Slant Relief': slantRelief,
        'Slide': slide,
        'Small Caps': smallCaps,
        'Small Isometric1': smallIsometric1,
        'Small Keyboard': smallKeyboard,
        'Small Poison': smallPoison,
        'Small Tengwar': smallTengwar,
        'Soft': soft,
        'Speed': speed,
        'Spliff': spliff,
        'Stacey': stacey,
        'Stampate': stampate,
        'Stampatello': stampatello,
        'Star Strips': starStrips,
        'Star Wars': starWars,
        'Stellar': stellar,
        'Stforek': stforek,
        'Stick Letters': stickLetters,
        'Stop': stop,
        'Straight': straight,
        'Stronger Than All': strongerThanAll,
        'Sub-Zero': subZero,
        'Swamp Land': swampLand,
        'Swan': swan,
        'Sweet': sweet,
        'Tanja': tanja,
        'Tengwar': tengwar,
        'Test1': test1,
        'The Edge': theEdge,
        'Thick': thick,
        'Thin': thin,
        'THIS': thisFont,
        'Thorned': thorned,
        'Three Point': threePoint,
        'Ticks Slant': ticksSlant,
        'Ticks': ticks,
        'Tiles': tiles,
        'Tinker-Toy': tinkerToy,
        'Tombstone': tombstone,
        'Train': train,
        'Trek': trek,
        'Tsalagi': tsalagi,
        'Tubular': tubular,
        'Twisted': twisted,
        'Two Point': twoPoint,
        'Univers': univers,
        'USA Flag': usaFlag,
        'Varsity': varsity,
        'Wavy': wavy,
        'Weird': weird,
        'Wet Letter': wetLetter,
        'Whimsy': whimsy,
        'Wow': wow
      }

      console.log('parsedFigletFonts:')
      for (let i in fonts) {
        figlet.parseFont(i, fonts[i])
        this.figletFonts.push(i)
        console.log(`  - ${i}`)
      }
    },
    targetTextSizeSliderTooltip (value) {
      return `${(value / 100 * 48 + 12).toFixed(1)}px`
    },
    alertCopy () {
      this.$message({message: '内容已复制。', type: 'success', duration: 1000})
    }
  }
}
</script>

<style lang="less" scoped>

  .target-text-size-slider-container {
    margin-bottom: 20px;
  }

  .target-text-container {
    width: 100%;
    margin-bottom: 20px;
    border-style: solid;
    border-width: 1px;
    border-color: #dcdfe6;
    border-radius: 4px;

    .target-text {
      width: 100%;
      overflow: auto;
      padding: 16px 8px;
      box-sizing: border-box;

      &::-webkit-scrollbar {
        height: 8px;
        width: 8px;
        background-color: transparent;
      }

      &::-webkit-scrollbar-thumb {
        border-radius: 8px;
        background-color: #939393;
      }

      &::-webkit-scrollbar-corner {
        background-color: transparent;
      }
    }
  }

  .copy-btn-container {
    padding: 5px 5px 0;
    text-align: right;
  }
  .copy-btn {
    cursor: pointer;
  }

  pre {
    margin: 0;
    font-family: monospace;
    color: #000000;

    .target-text {
      font-size: 2em;
    }
  }
</style>
