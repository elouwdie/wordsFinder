import {Component, computed, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [
    FormsModule
  ],
  templateUrl: './word-search.component.html',
  styleUrl: './word-search.component.css',
})
export class WordSearchComponent {
  numberOfWords = signal(2);
  searchedWord = signal('');
  searchedWordLetters = computed(() => this.searchedWord().split(''));
  readonly wordsList = signal(['gros', 'gras', 'graisse', 'agressif', 'go', 'ros', 'gro']);
  readonly searchResult = computed(() => this.searchWord());

  searchWord() {
    return this.wordsList().reduce((acc: { word: string, length: number, diff: number }[], word) => {
      if (word.length < this.searchedWord().length) {
        return acc;
      }

      let add = false;
      let diff = 0;
      for (let searchedLetter of this.searchedWordLetters()) {
        if (word.includes(searchedLetter)) {
          const wordIndex = word.indexOf(searchedLetter)
          const searchedWordIndex = this.searchedWordLetters().indexOf(searchedLetter);
          if (wordIndex >= searchedWordIndex) {
            if (word.length - wordIndex >= this.searchedWord().length - searchedWordIndex) {
              add = true;
              for (let i = (wordIndex - searchedWordIndex); i <= (wordIndex + this.searchedWord().length - searchedWordIndex); i++) {
                if (word[i] !== this.searchedWord()[i]) {
                  diff++;
                }
              }
            }
          }
        }
      }
      if (add) {
        acc.push({
          word: word,
          length: word.length,
          diff: diff
        });
      }
      return acc;
    }, [])
      .sort((a, b) => a.diff - b.diff || a.length - b.length || a.word.localeCompare(b.word))
      .slice(0, this.numberOfWords())
      .map(item => item.word);
  }
}
