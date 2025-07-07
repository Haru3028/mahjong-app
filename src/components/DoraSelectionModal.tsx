"use client";

import React, { useCallback, useState, useEffect, useRef } from 'react';
import { MahjongTile } from '../types/mahjong';
import { mahjongTiles } from '../data/mahjongTiles'; // 全ての麻雀牌データをインポート
import TileSelectionSection from './TileSelectionSection'; // 牌の表示に使っているコンポーネント

// DoraSelectionModalコンポーネントのPropsの型定義
interface DoraSelectionModalProps {
  currentDoraIndicators: MahjongTile[]; // 現在選択されているドラ表示牌のリスト
  onConfirm: (tiles: MahjongTile[]) => void; // 確定ボタンを押したときに呼ばれるコールバック
  onClose: () => void; // モーダルを閉じるときに呼ばれるコールバック
  isOpen: boolean; // モーダルの表示状態を制御するpropを追加
}

export default function DoraSelectionModal({
  currentDoraIndicators,
  onConfirm,
  onClose,
  isOpen, // isOpen prop を受け取る
}: DoraSelectionModalProps) {
  const [selectedDora, setSelectedDora] = useState<MahjongTile[]>(currentDoraIndicators);
  const dialogRef = useRef<HTMLDialogElement>(null); // dialog要素への参照

  // コンポーネントがマウントされた際に、親から渡されたドラ牌で初期化する
  useEffect(() => {
    setSelectedDora(currentDoraIndicators);
  }, [currentDoraIndicators]);

  // isOpen prop に応じてモーダルを表示・非表示
  useEffect(() => {
    // refが現在のDOMノードを参照していて、かつdialogがまだ開かれていない場合
    if (isOpen && !dialogRef.current?.open) {
      dialogRef.current?.showModal(); // モーダルを表示
    } else if (!isOpen && dialogRef.current?.open) {
      // refが現在のDOMノードを参照していて、かつdialogが開かれている場合
      dialogRef.current?.close(); // モーダルを閉じる
    }
  }, [isOpen]);

  const allAvailableTiles: MahjongTile[] = mahjongTiles; // mahjongTiles データ全体を使用

  // 牌がクリックされた時のハンドラ
  const handleTileClick = useCallback((tile: MahjongTile) => {
    // 選択された牌が既に selectedDora に含まれているかチェック (instanceId で一意性を判断)
    const existingTileIndex = selectedDora.findIndex(d => d.instanceId === tile.instanceId);

    if (existingTileIndex !== -1) {
      // 既に選択されていれば、リストから削除
      setSelectedDora(prev => prev.filter((_, index) => index !== existingTileIndex));
    } else {
      // 選択されていなければ、リストに追加
      setSelectedDora(prev => [...prev, tile]);
    }
  }, [selectedDora]);

  // dialogのcloseイベントハンドラ（Escキーでのクローズなどに対応）
  const handleDialogClose = useCallback(() => {
    onClose(); // 親コンポーネントのonCloseを呼び出す
  }, [onClose]);

  return (
    // <dialog>要素に変更し、refを渡す
    // クラスはモーダルの内容のスタイルを適用
    // onCancelでEscキー押下時の挙動をハンドリング
    <dialog
      ref={dialogRef}
      className="p-0 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto relative border border-gray-300"
      onCancel={handleDialogClose}
    >
      {/* 内部のコンテンツボックスは引き続きbg-white */}
      <div className="bg-white p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">ドラ表示牌を選択</h2>

        {/* 閉じるボタン */}
        <button
          onClick={onClose} // onClose 関数を呼び出してモーダルを閉じる
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl font-light leading-none"
        >
          &times; {/* HTMLエンティティでバツ印を表示 */}
        </button>

        {/* 現在選択されているドラ牌の表示セクション */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">現在のドラ表示牌</h3>
          <TileSelectionSection
            title="" // タイトルは不要なので空文字列
            tiles={selectedDora} // 選択中のドラ牌リストを渡す
            // クリックで選択から外すロジック (removeDoraIndicator のようなもの)
            onTileClick={(tile, index) => {
                setSelectedDora(prev => prev.filter((_, i) => i !== index));
            }}
            type="hand" // 手牌のように表示
          />
        </div>

        {/* 選択可能な牌の表示セクション */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">選択可能な牌</h3>
          <TileSelectionSection
            title="" // タイトルは不要なので空文字列
            tiles={allAvailableTiles} // 全ての麻雀牌データを渡す
            onTileClick={handleTileClick} // 牌がクリックされた時のハンドラ
            type="available" // 選択可能な牌のように表示
          />
        </div>

        {/* 確定ボタン */}
        <div className="flex justify-end mt-6">
          <button
            onClick={() => onConfirm(selectedDora)} // selectedDora を親に渡して確定
            className="py-2 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            確定
          </button>
        </div>
      </div>
    </dialog>
  );
}