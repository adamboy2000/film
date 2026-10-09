import type {ComponentType, SVGProps} from 'react'
import {ArrowUpRight as ArrowUpRightIcon, ArrowUp as ArrowUpIcon, Plus as PlusIcon, EditPencil, History as HistoryIcon, SettingsSlider, Check as CheckIcon, ChevronRight as ChevronRightIcon, ChevronDown as ChevronDownIcon, Copy as CopyIcon, Download as DownloadIcon, MagnifyingGlassSearch, FileDocument, X as XIcon, ArrowRotateCcw, ArrowRotateCw, EmojiLists, Quote as QuoteIcon, Link, ExternalLink as ExternalLinkIcon, SidebarCollapseLeft, SidebarLeft, SidebarRight, Chat, Suitcase, Mail as MailIcon, SoundOnReadOutLoudSpeaker, Globe as GlobeIcon, BookOpen as BookOpenIcon, Video as VideoIcon, Text, NotebookCheck, Moon as MoonIcon, Sun as SunIcon, Menu as MenuIcon, ArrowLeft as ArrowLeftIcon, Grid as GridIcon, Trash as TrashIcon, RestoreUntrash, Lock as LockIcon} from '@openai/apps-sdk-ui/components/Icon'

// Preserve the editor's size API while using the published OpenAI SVG artwork.
const icon = (Component:ComponentType<SVGProps<SVGSVGElement>>) =>
  ({size=20,...props}:SVGProps<SVGSVGElement>&{size?:number}) => <Component width={size} height={size} aria-hidden="true" {...props}/>
export const ArrowUpRight=icon(ArrowUpRightIcon), ArrowUp=icon(ArrowUpIcon), Plus=icon(PlusIcon), PenLine=icon(EditPencil), History=icon(HistoryIcon), Settings2=icon(SettingsSlider), Check=icon(CheckIcon), ChevronRight=icon(ChevronRightIcon), ChevronDown=icon(ChevronDownIcon), Copy=icon(CopyIcon), Download=icon(DownloadIcon), Search=icon(MagnifyingGlassSearch), FileText=icon(FileDocument), SlidersHorizontal=icon(SettingsSlider), X=icon(XIcon), RotateCcw=icon(ArrowRotateCcw), RotateCw=icon(ArrowRotateCw), List=icon(EmojiLists), Quote=icon(QuoteIcon), Link2=icon(Link), ExternalLink=icon(ExternalLinkIcon), PanelLeftClose=icon(SidebarCollapseLeft), PanelLeft=icon(SidebarLeft), PanelRight=icon(SidebarRight), MessageSquare=icon(Chat), Briefcase=icon(Suitcase), Mail=icon(MailIcon), Megaphone=icon(SoundOnReadOutLoudSpeaker), Globe=icon(GlobeIcon), BookOpen=icon(BookOpenIcon), Video=icon(VideoIcon), AlignLeft=icon(Text), CheckCheck=icon(NotebookCheck)

export const Moon=icon(MoonIcon), Sun=icon(SunIcon), Menu=icon(MenuIcon), ArrowLeft=icon(ArrowLeftIcon)

export const Grid=icon(GridIcon), Trash=icon(TrashIcon), Restore=icon(RestoreUntrash)

export const Lock=icon(LockIcon)

export const Figma=({size=20,...props}:SVGProps<SVGSVGElement>&{size?:number})=><svg width={size} height={size} viewBox="0 0 18 27" fill="currentColor" aria-hidden="true" {...props}><path d="M4.5 0h9a4.5 4.5 0 0 1 0 9h-9a4.5 4.5 0 0 1 0-9Z"/><path d="M4.5 9H9v9H4.5a4.5 4.5 0 0 1 0-9Z"/><circle cx="13.5" cy="13.5" r="4.5"/><path d="M0 18h9v4.5a4.5 4.5 0 0 1-9 0V18Z"/></svg>

// A solid cloud for the quiet save-status chip.
export const Cloud=({size=20,...props}:SVGProps<SVGSVGElement>&{size?:number})=><svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}><path d="M7 18.5a4.5 4.5 0 0 1-.8-8.93 6 6 0 0 1 11.56-1.25A5.1 5.1 0 0 1 18 18.5H7Z"/></svg>
